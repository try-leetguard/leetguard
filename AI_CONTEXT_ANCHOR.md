# AI_CONTEXT_ANCHOR — LeetGuard Machine Snapshot
<!-- PURPOSE: Feed this file to an LLM to restore full technical context after session loss. Not human docs. -->
<!-- LAST_ARCHITECTURE_LOCK: 2026-06-25 (DB integrity normalization + solve popup display-name fix locked) -->

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
| `LEETGUARD_AUTH_SYNC` / `OAUTH_SUCCESS` | `{ sync_id?, tokens, user? }` | `OAUTH_CALLBACK` → `extensionAuth.handleOAuthCallback()` → `syncEverything()` → `LEETGUARD_AUTH_SYNC_ACK` |
| `LEETGUARD_LOGOUT` | — | `USER_LOGOUT` → clear caches, restore default blocklist rules |

### Webapp emitters (canonical)

- `client/lib/blocklist-api.ts` → `notifyBlocklistUpdated(websites)` after add/remove
- `client/app/(dashboard)/activity/page.tsx` → `GOAL_UPDATED` with `{ goal: goalData }` after `PATCH /api/me/goal`
- `client/lib/auth-state.ts` → canonical token storage, refresh, auth sync, logout messages
- `client/lib/auth-context.tsx` → delegates token/auth side effects to `auth-state.ts`

### Network fallback (not happy path)

If `payload` is `null` or malformed, `syncBlocklist()` / `syncGoal()` fall back to `fetchUserBlocklist()` / `fetchUserGoal()` against FastAPI. Payload push is always preferred when data is already in the React layer.

### Responsibility split (idempotent bridge)

- **`webapp-detector.js`** — dashboard origin only: ping/pong, auth, blocklist, goal pushes
- **`content.js`** — LeetCode: solve telemetry + toggle symmetry; **does not** handle blocklist/goal/auth sync on dashboard (prevents duplicate listener paths and LeetCode-origin forgery)

---

## 3. AUTH / TOKEN STABILIZATION

**Architecture lock:** FastAPI is the token authority; the Next.js app owns `localStorage`; the MV3 extension owns enforcement state in `chrome.storage.local`. Auth changes are bridged explicitly via `window.postMessage` and never inferred from web `localStorage` by the extension.

### Client-side auth state (`client/lib/auth-state.ts`)

Canonical browser token keys:

| Key | Owner | Notes |
|-----|-------|-------|
| `access_token` | Next.js web app | Short-lived JWT with `token_use: "access"` |
| `refresh_token` | Next.js web app | Long-lived JWT with `token_use: "refresh"` |

Core helpers:

| Helper | Contract |
|--------|----------|
| `getAccessToken()` / `getRefreshToken()` | Browser-safe reads from `localStorage`; return `null` during SSR |
| `setAuthTokens(tokens, { syncExtension?, user? })` | Writes both tokens; syncs extension unless explicitly disabled |
| `refreshTokensOnce(refresher)` | Single-flight refresh. Concurrent 401s join one refresh promise. |
| `syncAuthWithExtension(tokens, user?)` | Posts `LEETGUARD_AUTH_SYNC` with `sync_id`; retries 3 times waiting for ACK; API retry does not block on ACK. |
| `clearAuthState()` | Removes both tokens, posts `LEETGUARD_LOGOUT`, dispatches `leetguardAuthCleared` + `userLoggedOut`. |

### Protected request flow (`client/lib/api.ts`)

```
authenticatedRequest(endpoint, options, fallbackToken)
  1. attach Authorization: Bearer {access_token || fallbackToken}
  2. fetch FastAPI
  3. on 401 once:
       await refreshTokensOnce(refreshToken => POST /auth/refresh)
       retry original request once with the new access token
  4. on refresh failure:
       clearAuthState()
       throw original auth error to caller
```

Refresh success writes both new tokens to `localStorage` and immediately broadcasts `LEETGUARD_AUTH_SYNC` to the extension bridge. Refresh failure clears web auth and broadcasts `LEETGUARD_LOGOUT`.

### ACK-based extension refresh sync

```
Next.js auth-state.ts
  └─ window.postMessage({
       type: 'LEETGUARD_AUTH_SYNC',
       sync_id,
       tokens: { access_token, refresh_token },
       user?
     }, window.location.origin)
       │
webapp-detector.js
  ├─ require event.origin === window.location.origin
  ├─ chrome.runtime.sendMessage({ type:'OAUTH_CALLBACK', tokens, user, sync_id })
  └─ window.postMessage({ type:'LEETGUARD_AUTH_SYNC_ACK', sync_id, success }, same-origin)
       │
background.js
  ├─ await extensionAuth.handleOAuthCallback(tokens)
  ├─ await syncEverything()
  └─ sendResponse({ success })
```

`background.js` uses the MV3-safe pattern: the listener is not `async`; it starts an async IIFE, calls `sendResponse`, and returns `true`.

### Logout / refresh-failure teardown

```
clearAuthState()
  └─ LEETGUARD_LOGOUT
       │
webapp-detector.js
  └─ USER_LOGOUT
       │
background.js
  ├─ extensionAuth.clearAuth()
  ├─ blocklistSync.clearCachedBlocklist()
  ├─ goalSync.clearCachedGoal()
  ├─ activityLogger.clearPendingActivities() if present
  ├─ if extension_blocking_enabled !== false → enableBlocking()   // DEFAULT_BLOCKLIST
  └─ else → disableBlocking()                                     // empty rules, defaults used next enable
```

### JWT claim contract (`server/app/utils/jwt.py`)

Access token:

```json
{
  "sub": "user-id-string",
  "token_use": "access",
  "iss": "leetguard-api",
  "aud": "leetguard-client",
  "iat": 1710000000,
  "exp": 1710001800,
  "jti": "uuid"
}
```

Refresh token has the same core fields but `token_use: "refresh"`, longer expiry, and is signed with `REFRESH_SECRET_KEY`.

Decode rules:

| Decoder | Signing key | Required `token_use` | Also validates |
|---------|-------------|----------------------|----------------|
| `decode_access_token()` | `SECRET_KEY` | `access` | `iss`, `aud`, `exp` |
| `decode_refresh_token()` | `REFRESH_SECRET_KEY` | `refresh` | `iss`, `aud`, `exp` |

Cross-use is rejected: refresh tokens cannot access bearer endpoints; access tokens cannot call `/auth/refresh`.

### FastAPI auth edge rules

| Flow | Rule |
|------|------|
| Protected bearer endpoints | `get_current_user` rejects malformed/missing/non-integer `sub`, missing users, wrong token type, and unverified users. |
| `/auth/refresh` | Decodes refresh token, re-fetches user, requires user exists + `is_verified == true`, then issues new access + refresh pair. |
| `/auth/login` unverified user | Verifies password first, writes a new verification code/expiry, sends email, returns `200 OK` verification-needed response, creates no JWTs, returns no tokens, triggers no client token storage/sync. |
| OAuth-only user | `users.hashed_password` may be `NULL`; password login returns invalid credentials instead of crashing. |

### Backend route compatibility

Canonical blocklist check:

```
GET /api/blocklist/check?website=example.com
```

Legacy fallback:

```
GET /api/blocklist/check/{website}
```

The query route is declared before the path route. Both call the same internal handler, so auth, normalization, errors, and response shape are identical. The client uses the query route because it safely supports full URLs and path-hostile characters.

### Database integrity contract

**Source of truth:** FastAPI + PostgreSQL via Alembic. Runtime app startup must not create tables; `server/app/db/session.py` only creates engine/session dependency. Test fixtures may still call `Base.metadata.create_all()` inside isolated schemas.

**Relationships:**

```
users 1 ────< blocklist_items
users 1 ────< activities
```

No many-to-many tables exist. `activities.topic_tags` is JSON text, not a tag join table. Daily goal/progress lives on `users` (`target_daily`, `progress_today`, `progress_date`) and remains the unlock source of truth.

**Normalization boundary:** `server/app/utils/normalization.py`

| Value | Canonical storage | Compatibility |
|-------|-------------------|---------------|
| Blocklist website | domain only, lowercase, no protocol/`www`/path/query/hash (`youtube.com`) | `https://www.youtube.com/watch?v=...` checks/removes as `youtube.com` |
| Activity status | `solved`, `attempted`, `bookmarked` | legacy `completed → solved`, `in_progress → attempted` |
| LeetCode problem URL | `https://leetcode.com/problems/{slug}/` | query/hash/description paths collapse to canonical problem URL |

**Uniqueness hardlocks:**

| Table | Constraint | Behavior |
|-------|------------|----------|
| `blocklist_items` | `uq_blocklist_items_user_website` on `(user_id, website)` | one canonical domain per user |
| `activities` | `uq_activities_user_problem_url` on `(user_id, problem_url)` | one canonical problem row per user; repeat posts update status |

Migration `add_data_integrity_constraints` normalizes existing rows, dedupes blocklist rows by lowest `id`, dedupes activities by newest `completed_at` then highest `id`, then adds constraints. Earlier migrations now create missing base tables on fresh DBs instead of relying on historical `Base.metadata.create_all()` side effects.

### PostgreSQL test isolation (`server/tests/conftest.py`)

Tests no longer use SQLite. Resolution order:

1. Use `TEST_DATABASE_URL` when supplied.
2. Otherwise start disposable `postgres:16-alpine` via `testcontainers`.
3. Fail fast if the resolved database URL is not PostgreSQL.

Isolation model:

```
session start:
  create unique schema test_{uuid}
  connect with search_path={schema}
  Base.metadata.create_all(engine)

each test:
  TRUNCATE all app tables RESTART IDENTITY CASCADE before and after

session teardown:
  drop schema cascade
  stop test container if owned by pytest
```

Live API smoke tests in `server/test_api.py` are opt-in via `RUN_LIVE_API_TESTS=1`; real Resend email integration tests require an actual non-test `RESEND_API_KEY`.

---

## 4. INITIALIZATION ROUTINE (`syncEverything`)

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

## 5. NETWORK INTERCEPTION ENGINE (DNR)

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

## 6. LEETCODE SOLVE TELEMETRY

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

Extract `problemSlug` from `window.location.pathname` (`/problems/{slug}/…`). Resolve user-facing `problemName` with priority: visible `[data-cy="question-title"]` text → cleaned `document.title` → titleized slug (`two-sum` → `Two Sum`). Build payload: `{ type:'SUBMISSION_ACCEPTED', slug, submissionId, timestamp, url, statusData, problemInfo }`, where `problemInfo.problem_name` uses `problemName`. Show congrats popup (`showLeetGuardPopup(problemName)`) **before** background delivery.

### `content.js` message delivery — extension context invalidation guards

After acceptance filter passes, `sendMessage` is wrapped in a **three-layer guard** to suppress uncaught `Extension context invalidated` errors during dev extension reloads (stale content-script context on an open LeetCode tab):

| Layer | Mechanism | On failure |
|-------|-----------|------------|
| **1. Pre-check** | `if (chrome.runtime && chrome.runtime.id)` | Log `[LeetGuard] Connection to extension lost.` — skip send entirely |
| **2. Sync try/catch** | `try { chrome.runtime.sendMessage(...) } catch` | Log `[LeetGuard] Extension context invalidated. Please refresh the page.` |
| **3. Async `.catch()`** | `.catch()` on `sendMessage` returned Promise (MV3) | Same invalidation log — covers async rejections post-reload |

Payload shape unchanged; only delivery is hardened. User must refresh LeetCode tab after reloading extension in `chrome://extensions`.

### Background handler — `processSubmissionAccepted(message)` transaction filter

**Architecture:** `chrome.runtime.onMessage` `SUBMISSION_ACCEPTED` branch is a **thin delegate** — it logs `{ submissionId, slug }` and calls `processSubmissionAccepted(message)`. All dedup logic and progress side effects live in that dedicated function; `updateProgressOnProblemSolved()` is never called directly from the listener.

**Problem solved:** LeetCode `/check/` polling fires multiple times per submission; re-submitting the same problem the same day must not inflate progress ("cheesing").

**Entry validation (`processSubmissionAccepted`):**
```js
submissionId = message.submissionId
slug         = message.slug
if (!submissionId || !slug) → console.warn + return
```

**Dedup caches (`chrome.storage.local`):**

| Cache key | Type | Purpose |
|-----------|------|---------|
| `processed_submission_ids` | `string[]` | Guard 1 — same `submissionId` never credited twice (kills multi-poll double counting) |
| `daily_solved_slugs` | `string[]` | Guard 2 — same problem `slug` never credited twice per calendar day (kills re-submittal cheesing) |

**Production transaction sequence (`processSubmissionAccepted`):**

```
READ processed_submission_ids, daily_solved_slugs (default [])

Guard 1 (anti-spam):
  if submissionId ∈ processed_submission_ids → log + return (pure no-op)

Guard 2 (anti-cheating):
  if slug ∈ daily_solved_slugs →
    log "already solved today"
    SET processed_submission_ids += submissionId   // record ID so this re-submit's polls hit Guard 1
    return — NO updateProgressOnProblemSolved(), NO backend POST

Success (both guards clear):
  SET processed_submission_ids += submissionId
  SET daily_solved_slugs     += slug             // write-ahead before increment
  SET leetguardSolved: true, focusMode: false
  await updateProgressOnProblemSolved()
    ├─ daily_progress += 1
    ├─ POST /api/me/goal/progress { delta: 1 }  (if authenticated)
    └─ if daily_progress >= target_daily → updateBlockingStorage(false)
```

**Daily cache flush:** `initializeBlockingFromStorage()` (called from `runStartupRoutine`) detects `extension_last_reset_date !== today` and atomically sets `processed_submission_ids: []`, `daily_solved_slugs: []`, `daily_progress: 0`, `guest_progress.progress_today: 0` alongside re-enabling blocking. Authenticated users may reconcile `daily_progress` from backend on next `syncEverything()`.

### Progress side effects (credited solve only)

- `leetguardSolved: true`, `focusMode: false` — written inside `processSubmissionAccepted` success path only
- `chrome.runtime.sendMessage({ type:'PROGRESS_UPDATED', progress, goal, isGoalCompleted })` → popup
- Congrats popup on LeetCode page — `content.js` `showLeetGuardPopup(problemName)` fires before background send (including re-submits blocked by Guard 2). The popup is built with DOM nodes, not `innerHTML`, so the title has stable spacing and cannot render as `solvedtwo-sum`.

---

## 7. DATA STORAGE MAPPING (`chrome.storage.local`)

| Key | Schema | Writer(s) | Reader(s) | Semantics |
|-----|--------|-----------|-----------|-----------|
| `access_token` | JWT string | `extensionAuth.setAuth`, `extensionAuth.refreshTokens`, `extensionAuth.handleOAuthCallback` | `extensionAuth.apiRequest`, sync modules | Extension-local access token mirror. Cleared on logout / failed OAuth callback. |
| `refresh_token` | JWT string | `extensionAuth.setAuth`, `extensionAuth.refreshTokens`, `extensionAuth.handleOAuthCallback` | `extensionAuth.refreshTokens` | Extension-local refresh token mirror. Replaced on every successful refresh. |
| `user` | user object | `extensionAuth.setAuth`, `extensionAuth.getCurrentUser` | `extensionAuth.init`, `extensionAuth.isAuthenticated` | Extension auth presence requires both `access_token` and `user`. |
| `user_blocklist` | `string[]` (domain strings, no protocol) | `syncEverything`, `applyBlocklistPayload`, `fetchUserBlocklist` | `getBlockRules`, `BlocklistSync.getCachedBlocklist` | Effective blocklist for authenticated users. Empty → fall back to `DEFAULT_BLOCKLIST` for DNR. |
| `user_goal` | `{ target_daily: int, progress_today: int, progress_date: string, is_goal_completed?: bool }` | `syncEverything`, `applyGoalPayload`, `fetchUserGoal` | `getCurrentGoalData`, popup, goal UI | Full goal profile mirror of `GET /api/me/goal`. |
| `daily_progress` | `int` | `syncEverything`, `persistGoal`, `updateProgressOnProblemSolved` | `popup.js`, blocking unlock check | **HARDLOCK:** must always equal `user_goal.progress_today`. Never diverge — `syncEverything` and `GoalSync.persistGoal()` enforce on every write. |
| `extension_blocking_enabled` | `boolean` | `updateBlockingStorage`, `initializeBlockingFromStorage` | DNR apply path, toggle UI | Master kill-switch for DNR rules. |
| `extension_last_reset_date` | `string` (ISO date `YYYY-MM-DD`) | `initializeBlockingFromStorage` | daily reset logic | New day → `extension_blocking_enabled: true`, flush dedup arrays + `daily_progress: 0`. |
| `processed_submission_ids` | `string[]` | `processSubmissionAccepted`, `initializeBlockingFromStorage` (daily flush) | same | Dedup: one increment per LeetCode submission ID. Guard 2 still appends ID without crediting slug. |
| `daily_solved_slugs` | `string[]` | `processSubmissionAccepted`, `initializeBlockingFromStorage` (daily flush) | same | Dedup: one increment per problem slug per calendar day. |
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
POST   /auth/refresh               → new access + refresh pair; refresh token only
GET    /me                         → current verified user; access token only
GET    /api/blocklist              → { websites: string[] }
POST   /api/blocklist/add
DELETE /api/blocklist/remove
GET    /api/blocklist/check        → query canonical: ?website=...
GET    /api/blocklist/check/{site} → legacy fallback, same handler
GET    /api/activity               → current user's activity rows; statuses canonical
POST   /api/activity               → create/update by canonical problem URL; accepts legacy statuses
GET    /api/activity/stats         → { total, solved, attempted }
PUT    /api/activity/{id}          → update owned activity; canonicalizes status/url
DELETE /api/activity/{id}          → delete owned activity
GET    /api/me/goal                → GoalResponse
PATCH  /api/me/goal                → { target_daily }
POST   /api/me/goal/progress       → { delta: 1 }
```

## DISTRIBUTED LOOP (ASCII)

```
Next.js ──postMessage(payload/auth sync)──► webapp-detector ──sendMessage──► background
                                             ▲                              ├─► storage.local
                                             └─AUTH_SYNC_ACK ◄─────────────┤
                                                                            ├─► DNR rules
                                                                            └─► FastAPI (login/sync/progress)

leetcode.com: injected.js ──postMessage──► content.js ──sendMessage(guarded)──► background
                                                                                  └─► processSubmissionAccepted → progress + unblock
```

---

*End anchor. For human-readable narrative see `ARCHITECTURE.md`. For run instructions see `README.md`.*
