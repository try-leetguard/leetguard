# LeetGuard Server

FastAPI backend for auth, goals, blocklists, progress, and extension sync.

Normal development runs through Docker Compose from the repo root. The container still runs Uvicorn; Docker owns starting and stopping it.

## Run Locally

From the repo root:

```bash
npm run dev:docker
```

Defaults:

| Service | Address |
| --- | --- |
| API | `http://localhost:8000` |
| Health check | `http://localhost:8000/health` |
| Postgres from host tools | `localhost:5433` |
| Postgres from the API container | `db:5432` |

Local Postgres uses database `leetguard`, user `leetguard`, and password `leetguard`.

The API container runs `alembic upgrade head` before starting.
API secrets are loaded from `server/.env`; Compose overrides `DATABASE_URL` so the API always uses the Docker Postgres service.

Stop without deleting data:

```bash
npm run dev:docker:down
```

Stop and delete the local Postgres volume:

```bash
npm run dev:docker:reset
```

## Environment

Docker Compose loads API secrets from `server/.env`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Ignored by Docker Compose for the API container; Compose sets the Docker DB URL |
| `SECRET_KEY` | Access token signing key |
| `REFRESH_SECRET_KEY` | Refresh token signing key |
| `RESEND_API_KEY` | Email provider API key |
| `FROM_EMAIL` | Sender address |
| `FRONTEND_URL` | Webapp origin for links and CORS |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials |

Compose also accepts these shell variables for local infrastructure:

| Variable | Purpose |
| --- | --- |
| `POSTGRES_DB` | Local database name |
| `POSTGRES_USER` | Local database user |
| `POSTGRES_PASSWORD` | Local database password |
| `API_PORT` | Host port mapped to container port `8000` |
| `POSTGRES_PORT` | Host port mapped to container port `5432` |

`server/.env.docker.example` documents the local Docker defaults.

## Migrations

Create a migration:

```bash
docker compose exec api alembic revision --autogenerate -m "describe_change"
```

Apply migrations:

```bash
docker compose exec api alembic upgrade head
```

## Tests

Run backend tests from a Python environment with server requirements installed:

```bash
cd server
pytest
```

Tests require PostgreSQL. If `TEST_DATABASE_URL` is not set, pytest starts a temporary `postgres:16-alpine` container through testcontainers.

To run against the Compose database instead:

```bash
cd server
TEST_DATABASE_URL=postgresql+psycopg2://leetguard:leetguard@localhost:5433/leetguard pytest
```

## Local Python Escape Hatch

Use this only when debugging outside Docker:

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql+psycopg2://leetguard:leetguard@localhost:5433/leetguard
npm run migrate
npm run dev
```
