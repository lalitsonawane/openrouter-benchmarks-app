# Benchline — OpenRouter Benchmarks

Mobile and web client for OpenRouter’s unified [list-benchmarks](https://openrouter.ai/docs/api/api-reference/benchmarks/list-benchmarks) API.

Browse Artificial Analysis indices, Design Arena standings, and OpenRouter evals from one Expo app that runs on iOS, Android, and the web.

## Features

- Filter by `source`, `task_type`, Design Arena `arena` / `category`, and `max_results`
- Ranked model list with primary scores and pricing
- Model detail sheet for full metric breakdown
- On-device OpenRouter API key storage
- Demo dataset so the UI works before a key is added

## Setup

```bash
npm install
cp .env.example .env   # optional notes only; the app stores the key on-device
npm run web            # web
npm start              # Expo Go / simulator
```

Paste an API key under **Settings**. Keys are sent only to `https://openrouter.ai/api/v1/benchmarks`.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo dev server |
| `npm run web` | Run the web app |
| `npm run android` | Open Android |
| `npm run ios` | Open iOS (macOS) |
| `npm run typecheck` | TypeScript check |

## API reference

```http
GET https://openrouter.ai/api/v1/benchmarks
Authorization: Bearer <OPENROUTER_API_KEY>
```

Query parameters: `source`, `task_type`, `arena`, `category`, `max_results`.

Rate limits: 30 requests/minute per key, 500 requests/day per account.

## Repository

https://github.com/lalitsonawane/openrouter-benchmarks-app
