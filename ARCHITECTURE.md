# LeetGuard Architecture

LeetGuard is a distributed loop: the webapp owns configuration, FastAPI owns durable state, and the Chrome extension enforces the "LeetCode tax" at the network layer. Everything below is custom to this product—not framework inventory.

## The distributed loop

```
Next.js (localhost:3000)
    │  postMessage (same-origin)
    ▼
webapp-detector.js ──chrome.runtime.sendMessage──► background.js
    │                                                    │
    │                                                    ├─► FastAPI /api/*  (source of truth)
    │                                                    └─► chrome.storage.local  (push cache)
    │
content.js (LeetCode only) ──SUBMISSION_ACCEPTED──► background.js ──► goal progress, unblock
```

When you save a blocklist or goal in the dashboard, the frontend does not wait for the extension to poll. It pushes a payload over `window.postMessage`; `webapp-detector.js` forwards it to the service worker, which writes storage and refreshes rules in one shot. LeetCode progress is a separate channel: only `content.js` + `injected.js` on `leetcode.com` watch submission APIs and emit solve events.

---

## Core interception engine

**Problem:** Content-script blockers are trivial to bypass. Sites like `x.com` ship aggressive Service Workers and client routers that can re-open blocked origins after a DOM-level redirect.

**Approach:** Block at `declarativeNetRequest` (DNR) in the MV3 service worker (`background.js`). Rules are dynamic, not static manifest entries, so the blocklist can change without repacking the extension.

### Rule construction

`getBlockRules(generation)` reads the effective blocklist from `BlocklistSync.getCurrentBlocklist()` (user list from storage/API, or `DEFAULT_BLOCKLIST` for guests/logout). Each entry becomes a DNR rule:

- **Action:** `redirect` to the LeetGuard webapp (`http://localhost:3000/` in dev).
- **Condition:** `urlFilter: ||{domain}` on `main_frame` and `sub_frame`—the `||` anchor matches the registrable domain and paths without fragile `/*` suffixes that miss naked origins like `https://x.com`.
- **IDs:** `generation * 10000 + index` so concurrent updates never collide.

`enableBlocking()` / `disableBlocking()` run through `enqueueRuleUpdate()`, a promise chain that serializes DNR mutations. `updateDynamicRules()` atomically removes all existing dynamic rule IDs, then adds the new set—no stale rules left behind.

Blocking is gated by `extension_blocking_enabled` in `chrome.storage.local`. Hitting the daily solve target calls `updateBlockingStorage(false)` automatically; a new calendar day resets to enabled via `extension_last_reset_date`.

### Payload-driven blocklist sync

Network fetch is the fallback, not the happy path. When the dashboard mutates a blocklist, `BlocklistAPI.notifyBlocklistUpdated()` posts:

```js
{ type: 'BLOCKLIST_UPDATED', payload: { websites: [...] } }
```

`webapp-detector.js` forwards this to the background handler, which calls `blocklistSync.syncBlocklist(payload)`. If `payload.websites` is present, `applyBlocklistPayload()` writes `user_blocklist` to storage and immediately calls `enableBlocking()`—no round trip to `/api/blocklist` required for the redirect rules to update.

The same pattern exists for goals via `GOAL_UPDATED` → `goalSync.syncGoal(payload)`.

---

## Single-flight sync handler

On cold start, install, and browser startup, the service worker runs `runStartupRoutine()`:

1. `initializeBlockingFromStorage()` — daily reset logic + apply stored toggle to DNR.
2. `syncEverything()` — pull authenticated snapshot from the backend and reconcile local cache.

### `waitForSyncModules()`

`background.js` `importScripts` auth, blocklist, and goal modules asynchronously. `blocklistSync` and `goalSync` are assigned inside those files after `extensionAuth.init()`. Calling sync before they exist was a real race: fetches would no-op or throw.

`waitForSyncModules()` polls every 25ms (5s cap) until both globals exist. The cold-start path at the bottom of `background.js` awaits this before `runStartupRoutine()`; `syncEverything()` awaits it again defensively.

### `syncEverything()` semantics

Two layers of single-flight:

| Mechanism | Purpose |
|-----------|---------|
| `syncEverythingChain` | Concurrent `syncEverything()` calls chain on one promise—only one full snapshot runs at a time. |
| `enqueueRuleUpdate()` | DNR writes never interleave with a half-applied blocklist. |

When authenticated, `syncEverything()` runs `Promise.all([blocklistSync.fetchUserBlocklist(), goalSync.fetchUserGoal()])`, then writes `user_blocklist`, `user_goal`, and `daily_progress` to `chrome.storage.local`. It always ends by re-applying DNR from the toggle flag—so a successful API sync and a failed one both leave blocking consistent with `extension_blocking_enabled`.

Triggers: extension install/startup, `OAUTH_CALLBACK` after token handoff, and any time you need a full resync after auth state changes.

---

## Idempotent message bridge

The extension deliberately splits **webapp origin** traffic from **LeetCode origin** traffic. Both use `postMessage`, but responsibilities do not overlap.

### `webapp-detector.js` (dashboard origin)

Runs on `localhost:3000` and production app hosts. Owns the handshake with the Next.js app:

| Direction | Message | Behavior |
|-----------|---------|----------|
| App → ext | `LEETGUARD_PING` | Responds `LEETGUARD_PONG` with version, dev-mode flag, feature list. |
| App → ext | `LEETGUARD_AUTH_SYNC` / `OAUTH_SUCCESS` | Forwards tokens to `OAUTH_CALLBACK` in background. |
| App → ext | `LEETGUARD_LOGOUT` | Forwards `USER_LOGOUT`, clears caches, restores default blocklist rules. |
| App → ext | `BLOCKLIST_UPDATED`, `GOAL_UPDATED` | Forwards payload to background for storage + DNR/goal apply. |
| Ext → app | DOM `#leetguard-extension-installed`, `window.leetguardExtension`, `leetguardExtensionReady` | Lets React detect the extension without polling `chrome.runtime` from page JS. |

Same-origin checks on `event.origin` prevent cross-site pages from driving extension state.

### `content.js` (LeetCode + limited webapp helpers)

On LeetCode, `content.js` injects `injected.js` into the page context to hook LeetCode's submission/status XHR flow. A real accepted submission (`status_code === 10`, judger task, non-`runcode_` id) becomes `SUBMISSION_ACCEPTED` → background increments progress and may disable blocking when the daily target is met.

On the dashboard host, `content.js` only bridges **extension toggle** symmetry:

- `EXTENSION_TOGGLE` / `REQUEST_TOGGLE_STATE` ↔ `chrome.storage.local.extension_blocking_enabled`
- `chrome.storage.onChanged` → `TOGGLE_STATE_CHANGED` back to the page

It explicitly does **not** handle blocklist, goal, or auth sync—that lives in `webapp-detector.js` so LeetCode injection logic never runs on the settings UI and webapp pushes stay idempotent (one listener path per message type).

### Why this split matters

- **Security boundary:** Page scripts on LeetCode cannot forge blocklist payloads meant for the dashboard origin listener in `webapp-detector.js`.
- **Reliability:** Solve detection DOM hooks stay isolated from dashboard React hydration races.
- **Idempotence:** Duplicate `BLOCKLIST_UPDATED` posts with the same `websites` array rewrite the same storage keys and refresh the same DNR generation—safe to fire after every API mutation.

---

## State ownership

| Data | Source of truth | Extension cache |
|------|-----------------|-----------------|
| Blocklist | PostgreSQL via `GET/POST /api/blocklist` | `user_blocklist` |
| Daily goal & progress | PostgreSQL via `/api/me/goal` | `user_goal`, `daily_progress` |
| Auth tokens | Issued by FastAPI; webapp `localStorage` | Extension auth module (synced via postMessage) |
| Blocking on/off | User toggle + auto-unlock on goal | `extension_blocking_enabled` |
| Active DNR rules | Derived from cache + toggle | Chrome DNR dynamic rule store |

FastAPI wins on conflict after login or `syncEverything()`. The webapp push path wins for sub-second UX when editing settings while logged in. Guest mode never hits the API: defaults in `background.js` and `chrome.storage.local` (`guest_progress`) drive behavior until OAuth sync runs.

---

## Operational notes

- **Redirect target:** DNR redirect URLs point at the local webapp in development; production builds should align this with your deployed app origin.
- **Service worker lifetime:** MV3 workers sleep; `onStartup`, `onInstalled`, and the cold-start `waitForSyncModules().then(runStartupRoutine)` path rehydrate rules from storage so blocking survives browser restarts.
- **Debug:** `chrome.tabs.onUpdated` logs navigations to known blocked domains and verifies redirect landing—useful when a domain still loads despite an apparently correct rule set.

For how to run the stack locally, see [README.md](README.md).
