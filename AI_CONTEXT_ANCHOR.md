# AI_CONTEXT_ANCHOR — LeetGuard Machine Snapshot
<!-- PURPOSE: Feed this file to an LLM to restore full technical context after session loss. Not human docs. -->
<!-- LAST_ARCHITECTURE_LOCK: 2026-06-05 -->

---

## 1. CORE MISSION

LeetGuard is the **"LeetCode Tax"** — a behavioral utility that enforces interview-prep discipline by blocking distracting social/media domains at the **network layer** (Chrome MV3 extension) until the user completes a configurable daily count of LeetCode algorithm solves. Configuration (blocklist, daily goal, auth) lives in a **Next.js dashboard** backed by **FastAPI + PostgreSQL**; the extension is the enforcement agent that redirects blocked origins to the webapp and auto-unlocks when `daily_progress >= target_daily`.

---

## 2. SYNC MODEL (PAYLOAD-DRIVEN PUSH)

**Principle:** The Next.js web app never fires blank sync signals. Every dashboard mutation that affects extension state ships the **full updated payload** in the same `window.postMessage` call. The extension applies data locally — no redundant backend round-trip on the happy path.

### Push flow

```
Next.js (after API success)
  └─ window.postMessage({ type, payload }, '*')
       │
webapp-detector.js  [content script on localhost:3000 | leetguard.com]
  ├─ event.origin === window.location.origin  (reject cross-origin)
  └─ chrome.runtime.sendMessage({ type, payload })
       │
background.js  [MV3 service worker]
  ├─ BLOCKLIST_UPDATED → blocklistSync.syncBlocklist(payload)
  └─ GOAL_UPDATED      → goalSync.syncGoal(payload)
```

### Message contracts

| `type` | `payload` shape | Extension handler |
|--------|-------------------|-------------------|
| `BLOCKLIST_UPDATED` | `{ websites: string[] }` | `BlocklistSync.applyBlocklistPayload()` → `user_blocklist` + DNR refresh |
| `GOAL_UPDATED` | `{ goal: GoalObject }` | `GoalSync.applyGoalPayload()` → `user_goal` + `daily_progress` |
| `LEETGUARD_AUTH_SYNC` / `OAUTH_SUCCESS` | `{ tokens, user? }` | `OAUTH_CALLBACK` → `extensionAuth.handleOAuthCallback()` → `syncEverything()` |
| `LEETGUARD_LOGOUT` | — | `USER_LOGOUT` → clear caches, restore default blocklist rules |

### Webapp emitters (canonical)

- `client/lib/blocklist-api.ts` → `notifyBlocklistUpdated(websites)` after add/remove
- `client/app/(dashboard)/activity/page.tsx` → `GOAL_UPDATED` with `{ goal: goalData }` after `PATCH /api/me/goal`
- `client/lib/auth-context.tsx` → auth sync / logout messages

### Network fallback (not happy path)

If `payload` is `null` or malformed, `syncBlocklist()` / `syncGoal()` fall back to `fetchUserBlocklist()` / `fetchUserGoal()` against FastAPI. Payload push is always preferred when data is already in the React layer.

### Responsibility split (idempotent bridge)

- **`webapp-detector.js`** — dashboard origin only: ping/pong, auth, blocklist, goal pushes
- **`content.js`** — LeetCode: solve telemetry + toggle symmetry; **does not** handle blocklist/goal/auth sync on dashboard (prevents duplicate listener paths and LeetCode-origin forgery)

---

## 3. INITIALIZATION ROUTINE (`syncEverything`)

**File:** `extension/background.js`

### Module race neutralization: `waitForSyncModules()`

`background.js` loads sync modules via `importScripts('auth.js', 'blocklist-sync.js', 'goal-sync.js')`. Globals `blocklistSync` and `goalSync` are assigned asynchronously inside those files after `extensionAuth.init()`. Calling sync before they exist caused cold-start races.

```js
waitForSyncModules(maxWaitMs = 5000)
  // polls every 25ms until blocklistSync && goalSync both truthy
  // throws 'Sync modules not ready' on timeout
```

**Call sites:** bottom-of-file cold-start path; first line inside `syncEverything()` (defensive re-await).

### `syncEverything()` — single-flight full snapshot

```js
syncEverything()
  1. await waitForSyncModules()
  2. await extensionAuth.init()
  3. chain onto syncEverythingChain (only one snapshot executes at a time)
  4. if extensionAuth.isAuthenticated():
       const [, goal] = await Promise.all([
         blocklistSync.fetchUserBlocklist(),   // GET /api/blocklist
         goalSync.fetchUserGoal(),             // GET /api/me/goal
       ])
       chrome.storage.local.set({
         user_blocklist: blocklistSync.localBlocklist,
         user_goal: goal,
         daily_progress: goal?.progress_today ?? 0,  // HARDLOCK: must mirror backend
       })
     else: log skip (guest/unauthenticated)
  5. read extension_blocking_enabled → enableBlocking() | disableBlocking()
  6. on error: still re-apply DNR from toggle flag (blocking stays consistent)
```

### `runStartupRoutine()`

```
initializeBlockingFromStorage()   // daily reset via extension_last_reset_date
  → syncEverything()
```

### Lifecycle triggers

| Event | Action |
|-------|--------|
| `chrome.runtime.onStartup` | `runStartupRoutine()` |
| `chrome.runtime.onInstalled` | `runStartupRoutine()` |
| Service worker cold start (bottom of `background.js`) | `waitForSyncModules().then(runStartupRoutine)` |
| `OAUTH_CALLBACK` success | `syncEverything()` |
| Dashboard `BLOCKLIST_UPDATED` / `GOAL_UPDATED` | payload apply (not full snapshot unless auth just landed) |

### Concurrent-write serialization (second single-flight layer)

`enqueueRuleUpdate()` + `rulesUpdateChain` serialize all DNR mutations. `syncEverythingChain` serializes full backend snapshots. These layers do not interleave half-applied blocklists with rule refreshes.

---

## 4. NETWORK INTERCEPTION ENGINE (DNR)

**Why not content-script blocking:** DOM redirects are bypassed by aggressive Service Workers and client-side routers on SPAs (notably `x.com`, `twitter.com`). LeetGuard blocks at **`chrome.declarativeNetRequest`** in the MV3 service worker — before the page loads.

### Rule construction (`getBlockRules(generation)`)

1. Resolve effective blocklist: `BlocklistSync.getCurrentBlocklist()` → `user_blocklist` if authenticated, else `DEFAULT_BLOCKLIST`
2. Per site entry:
   - `cleanSite = site.replace(/^(https?:\/\/)?(www\.)?/, '').trim()`
   - `urlFilter: '||' + cleanSite` — **domain anchor, no trailing `/*`**
     - Matches naked origins (`https://x.com`) and all subpaths/subdomains per DNR `||` semantics
     - Avoids fragile path-suffix rules that miss SPA root navigations
   - `resourceTypes: ['main_frame', 'sub_frame']`
   - `action: { type: 'redirect', redirect: { url: 'http://localhost:3000/' } }` (dev; align for prod)
   - `id: generation * 10000 + (idx + 1)` — generation-scoped IDs prevent collision on rapid updates
   - `priority: 1`

### Rule lifecycle

```
enableBlocking()  → ++rulesGeneration → enqueueRuleUpdate → getBlockRules → updateDynamicRules
disableBlocking() → enqueueRuleUpdate → updateDynamicRules([])  // strip all dynamic rules
updateDynamicRules:
  removeRuleIds = all existing dynamic rule IDs
  addRules = new set (atomic swap — no stale rules)
```

### Blocking gate

`extension_blocking_enabled` in `chrome.storage.local` (default `true`). Auto-disabled when goal met (`updateProgressOnProblemSolved` → `updateBlockingStorage(false)`). New calendar day resets to enabled via `extension_last_reset_date` in `initializeBlockingFromStorage()`.

### Default blocklist (guest / logout / empty user list)

`facebook.com`, `reddit.com`, `youtube.com`, `instagram.com`, `x.com`, `twitter.com`

---

## 5. LEETCODE SOLVE TELEMETRY

**Detection strategy:** API interception, **not** DOM/MutationObservers. LeetCode UI class churn does not break detection.

### Injection chain (`extension/content.js` → `extension/injected.js`)

```
content.js (document_start on https://leetcode.com/*)
  └─ inject <script src="chrome-extension://…/injected.js"> into page context
injected.js (page world — can patch window.fetch)
  └─ wraps native window.fetch, delegates non-matching calls unchanged
```

### `injected.js` fetch hooks

| URL pattern | Hook behavior |
|-------------|---------------|
| `url.includes('/submit/')` | Await response, clone JSON, `postMessage({ source:'leetguard-injected', type:'submission', responseData })` — **logging only, does NOT count solve** |
| `url.includes('/check/')` | Await response, clone JSON, `postMessage({ source:'leetguard-injected', type:'status_check', responseData })` — **primary solve signal** |

### `content.js` acceptance filter (on `status_check`)

Emit `SUBMISSION_ACCEPTED` to background **only when all hold:**

```
statusData.status_code === 10                          // Accepted
statusData.task_name === 'judger.judgetask.Judge'      // real judge, not test harness
statusData.question_id                                 // truthy
statusData.finished === true
!statusData.submission_id.startsWith('runcode_')       // exclude "Run Code" polls
```

Extract `problemSlug` from `window.location.pathname` (`/problems/{slug}/…`). Attach `submissionId: statusData.submission_id`.

### Background idempotent transaction queue (`SUBMISSION_ACCEPTED` handler)

**Problem solved:** LeetCode `/check/` polling fires multiple times per submission; re-submitting the same problem the same day must not inflate progress ("cheesing").

**Enforcement (background.js):** Before `updateProgressOnProblemSolved()`, the handler consults `chrome.storage.local` dedup caches:

| Cache key | Type | Purpose |
|-----------|------|---------|
| `processed_submission_ids` | `string[]` | Idempotent guard — same `submissionId` never increments twice (kills multi-poll double counting) |
| `daily_solved_slugs` | `string[]` | Per-calendar-day unique problem slugs — re-solving same slug same day is ignored (kills re-submittal cheesing) |

**Transaction sequence:**

```
1. if submissionId ∈ processed_submission_ids → return (no-op)
2. if problemSlug ∈ daily_solved_slugs → return (no-op)
3. append submissionId to processed_submission_ids
4. append problemSlug to daily_solved_slugs
5. chrome.storage.local.set(dedup caches)
6. updateProgressOnProblemSolved()
     ├─ daily_progress += 1
     ├─ POST /api/me/goal/progress { delta: 1 }  (if authenticated)
     └─ if daily_progress >= target_daily → updateBlockingStorage(false)
```

Dedup caches reset with daily progress rollover (`extension_last_reset_date` / backend `progress_date` reconciliation via `syncEverything`).

### Progress side effects

- `leetguardSolved: true`, `focusMode: false` written on accept
- `chrome.runtime.sendMessage({ type:'PROGRESS_UPDATED', progress, goal, isGoalCompleted })` → popup
- Congrats popup injected on LeetCode page (`showLeetGuardPopup(problemSlug)`)

---

## 6. DATA STORAGE MAPPING (`chrome.storage.local`)

| Key | Schema | Writer(s) | Reader(s) | Semantics |
|-----|--------|-----------|-----------|-----------|
| `user_blocklist` | `string[]` (domain strings, no protocol) | `syncEverything`, `applyBlocklistPayload`, `fetchUserBlocklist` | `getBlockRules`, `BlocklistSync.getCachedBlocklist` | Effective blocklist for authenticated users. Empty → fall back to `DEFAULT_BLOCKLIST` for DNR. |
| `user_goal` | `{ target_daily: int, progress_today: int, progress_date: string, is_goal_completed?: bool }` | `syncEverything`, `applyGoalPayload`, `fetchUserGoal` | `getCurrentGoalData`, popup, goal UI | Full goal profile mirror of `GET /api/me/goal`. |
| `daily_progress` | `int` | `syncEverything`, `persistGoal`, `updateProgressOnProblemSolved` | `popup.js`, blocking unlock check | **HARDLOCK:** must always equal `user_goal.progress_today`. Never diverge — `syncEverything` and `GoalSync.persistGoal()` enforce on every write. |
| `extension_blocking_enabled` | `boolean` | `updateBlockingStorage`, `initializeBlockingFromStorage` | DNR apply path, toggle UI | Master kill-switch for DNR rules. |
| `extension_last_reset_date` | `string` (ISO date `YYYY-MM-DD`) | `initializeBlockingFromStorage` | daily reset logic | New day → force `extension_blocking_enabled: true`. |
| `processed_submission_ids` | `string[]` | `SUBMISSION_ACCEPTED` handler | same | Dedup: one increment per LeetCode submission ID. |
| `daily_solved_slugs` | `string[]` | `SUBMISSION_ACCEPTED` handler | same | Dedup: one increment per problem slug per day. |
| `guest_progress` | goal-shaped object | guest path in `updateProgressOnProblemSolved` | `getCurrentGoalData` (unauthenticated) | Offline guest mode; no API. |
| `pending_progress_update` | `int` | failed backend progress POST | retry path | Staged delta when `/api/me/goal/progress` fails. |

### Source-of-truth hierarchy

```
FastAPI + PostgreSQL  ──wins on conflict after login / syncEverything()
Webapp payload push     ──wins for sub-second UX during active dashboard edits
chrome.storage.local    ──enforcement cache (DNR + popup read this)
Chrome DNR dynamic store──derived runtime artifact (not persisted by us)
```

---

## REPO LAYOUT (enforcement-relevant only)

```
client/          Next.js 14 dashboard (localhost:3000)
server/          FastAPI (localhost:8000), Alembic migrations, PostgreSQL
extension/       MV3 Chrome extension (load unpacked)
  background.js       service worker: DNR, syncEverything, message hub
  webapp-detector.js  dashboard content script: postMessage bridge
  content.js          LeetCode + dashboard toggle bridge
  injected.js         page-context fetch interceptor
  blocklist-sync.js   BlocklistSync class
  goal-sync.js        GoalSync class
  auth.js             extensionAuth, apiRequest, OAuth token storage
  manifest.json       MV3, permissions: declarativeNetRequest, storage, tabs
```

## FASTAPI ENDPOINTS (extension-touching)

```
GET    /api/blocklist              → { websites: string[] }
POST   /api/blocklist/add
DELETE /api/blocklist/remove
GET    /api/me/goal                → GoalResponse
PATCH  /api/me/goal                → { target_daily }
POST   /api/me/goal/progress       → { delta: 1 }
```

## DISTRIBUTED LOOP (ASCII)

```
Next.js ──postMessage(payload)──► webapp-detector ──sendMessage──► background
                                                                    ├─► storage.local
                                                                    ├─► DNR rules
                                                                    └─► FastAPI (login/sync/progress)

leetcode.com: injected.js ──postMessage──► content.js ──SUBMISSION_ACCEPTED──► background
                                                                                  └─► progress + unblock
```

---

*End anchor. For human-readable narrative see `ARCHITECTURE.md`. For run instructions see `README.md`.*
