# LeetGuard Extension

Chrome Manifest V3 extension for blocking distracting sites, detecting LeetCode progress, and syncing state with the webapp.

## Run Locally

1. Start the backend with `npm run dev:docker`.
2. Start the webapp with `cd client && npm run dev`.
3. Open `chrome://extensions`.
4. Enable Developer mode.
5. Click Load unpacked and select this `extension/` directory.

The extension is loaded directly from source. There is no build step.

## Local API

The extension currently calls `http://localhost:8000`.

If you run the API on another port, update both:

| File | What to change |
| --- | --- |
| `extension/auth.js` | `API_BASE_URL` |
| `extension/manifest.json` | `host_permissions` entry for localhost |

## Key Files

| File | Purpose |
| --- | --- |
| `background.js` | Service worker and blocking orchestration |
| `content.js` | LeetCode page detection |
| `webapp-detector.js` | Webapp to extension sync bridge |
| `auth.js` | API auth calls |
| `blocklist-sync.js` | Blocklist sync |
| `goal-sync.js` | Goal and progress sync |
| `popup.html` | Extension popup UI |
