# LeetGuard

LeetGuard is the "LeetCode tax" for your browser: distracting sites stay blocked at the network layer until you hit your daily solve count on LeetCode. Configure goals and blocklists in the webapp; the Chrome extension enforces them before Service Workers on sites like X can talk their way past a content-script blocker.

Engineering deep-dive: [ARCHITECTURE.md](ARCHITECTURE.md)

## Quick start

**1. Database**

```bash
createdb leetguard_db   # or your preferred PostgreSQL database name
cp server/.env.example server/.env
# Set DATABASE_URL in server/.env
```

**2. API**

```bash
cd server && npm install && npm run migrate && npm run dev
```

Runs FastAPI at `http://localhost:8000` with schema applied via Alembic.

**3. Webapp**

```bash
cd client && npm install && npm run dev
```

Dashboard at `http://localhost:3000`.

**4. Extension**

Open `chrome://extensions` → Developer mode → **Load unpacked** → select the `extension/` directory. Sign in on the webapp so auth and blocklist sync propagate to the service worker.

From the repo root you can also run `npm run dev` to start client and server together after dependencies are installed.

## State at a glance

```
┌─────────────────────────────────────────────────────────────┐
│  FastAPI + PostgreSQL                                       │
│  Source of truth: users, blocklist, daily goal, progress    │
└───────────────────────────┬─────────────────────────────────┘
                            │  REST (on login / syncEverything)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  chrome.storage.local                                       │
│  Push cache: user_blocklist, user_goal, daily_progress,     │
│  extension_blocking_enabled                                 │
└───────────────────────────┬─────────────────────────────────┘
                            │  instant apply
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  declarativeNetRequest (background.js)                      │
│  Enforces blocklist → redirect to webapp until goal met     │
└─────────────────────────────────────────────────────────────┘

Dashboard edits ──postMessage──► webapp-detector ──► storage + DNR refresh
LeetCode solve  ──content.js──► background ──► progress + optional unblock
```

## Repository

| Path | Role |
|------|------|
| `client/` | Next.js dashboard, auth, blocklist/goal UI |
| `server/` | FastAPI API and PostgreSQL persistence |
| `extension/` | MV3 service worker, DNR blocking, LeetCode detection |

## License

MIT — see [LICENSE](LICENSE).
