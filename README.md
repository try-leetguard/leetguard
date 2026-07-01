# LeetGuard

LeetGuard blocks distracting sites until the user makes daily LeetCode progress. The webapp owns account, goal, and blocklist state; the API persists it; the Chrome extension enforces it.

For deeper system notes, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Stack

| Path | Runtime | Role |
| --- | --- | --- |
| `client/` | Next.js, TypeScript, Tailwind CSS | Webapp, auth, dashboard, marketing pages |
| `server/` | FastAPI, SQLAlchemy, Alembic | API, auth, persistence |
| `extension/` | Chrome Manifest V3 | Blocking, LeetCode detection, webapp sync |
| `docker-compose.yml` | Docker Compose | Local API and Postgres |

## Local Development

Requirements: Node 18+, npm 9+, Docker Desktop.

Start the backend stack:

```bash
npm run dev:docker
```

This starts FastAPI and a local Postgres container. The API container runs Alembic migrations before starting Uvicorn.
API secrets are loaded from `server/.env`; Docker still overrides `DATABASE_URL` so the backend writes to the Compose Postgres service.

| Service | Local address |
| --- | --- |
| API | `http://localhost:8000` |
| API health check | `http://localhost:8000/health` |
| Postgres from DBeaver/psql | `localhost:5433` |
| Postgres from the API container | `db:5432` |

Local Postgres uses database `leetguard`, user `leetguard`, and password `leetguard`.

Start the webapp:

```bash
cd client
npm install
npm run dev
```

The webapp runs at `http://localhost:3000` and defaults to `http://localhost:8000` for the API. Override with `NEXT_PUBLIC_API_URL` if needed.

Load the extension:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked and select `extension/`.

The extension currently expects the local API at `http://localhost:8000`.

If you change `server/.env`, recreate the API container:

```bash
npm run dev:docker:down
npm run dev:docker
```

## Docker Commands

```bash
npm run dev:docker:detach  # start in the background
npm run dev:docker:down    # stop containers, keep the Postgres volume
npm run dev:docker:reset   # stop containers and delete the Postgres volume
```

Use alternate host ports when another project is already using the defaults:

```bash
API_PORT=8001 npm run dev:docker
POSTGRES_PORT=5434 npm run dev:docker
```

## Common Commands

| Command | Purpose |
| --- | --- |
| `cd client && npm run build` | Build the webapp |
| `cd server && pytest` | Run backend tests from the host |
| `docker compose exec api alembic upgrade head` | Apply migrations in the API container |
| `docker compose logs -f api` | Stream API logs |
| `docker compose logs -f db` | Stream Postgres logs |

Backend tests use PostgreSQL. If `TEST_DATABASE_URL` is not set, the test suite starts a temporary `postgres:16-alpine` container through testcontainers.

## License

MIT.
