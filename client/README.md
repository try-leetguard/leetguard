# LeetGuard Client

Next.js webapp for LeetGuard. It includes the marketing site, auth pages, dashboard, blocklist, goals, and account flows.

## Run Locally

Start the backend first from the repo root:

```bash
npm run dev:docker
```

Then start the webapp:

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## API URL

The client defaults to `http://localhost:8000`.

Override it with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8001 npm run dev
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next lint |

Image optimization runs automatically before dev and build through the package scripts.
