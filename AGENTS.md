# AGENTS.md

## Project Overview
Lacak.AI Pro — a single-page AI investigation assistant UI (Indonesian language) with a serverless-style search API that queries Wikipedia's public REST API. No external credentials required.

## Architecture
- **Frontend**: Static `index.html` (no framework, no build step). Served directly by the Express server.
- **API**: `api/search.js` — a Vercel-style serverless function (`export default async function handler(req, res)`) adapted to run under Express. Queries Wikipedia ID + EN REST search endpoints, deduplicates, and returns JSON.
- **Server**: `server.js` — minimal Express server that serves `index.html` at `/` and mounts the search handler at `/api/search`. ESM (`"type": "module"`).

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Node 22 (slim) image, source bind-mounted at `/app`.
- `npm install` runs on container startup, then `nodemon server.js` for live reload.
- Web entry point on port 3000.
- Healthcheck: `GET /` via Node's built-in fetch.

## Verification
- `curl http://localhost:3000/` → 200, serves `index.html`.
- `curl http://localhost:3000/api/search?q=test` → JSON with `results` array from Wikipedia.
