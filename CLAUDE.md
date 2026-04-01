# CLAUDE.md — PondCheck Project Brain

> Claude reads this file at the start of every session. Keep it focused and structured.

## Project Overview
- **Name**: PondCheck
- **Description**: A PWA demo for Skretting field technicians to capture pond inspection data via structured checklists, with simulated SMS validation powered by the Claude API. Designed for a senior leadership audience at Skretting/Nutreco.
- **Owner**: Skretting / Nutreco (demo build)

## Purpose
This is a **proof-of-concept demo**, not a production app. It demonstrates:
1. Field data capture via mobile-friendly checklists (8 types)
2. Simulated SMS conversation showing submitted data
3. Claude API analysis for cross-field plausibility validation
4. Persistent submission history via SQLite

There is no real SMS, no auth, no production infrastructure.

## Tech Stack
- **Frontend**: React 18 (Vite), Tailwind CSS v3, Lucide React icons
- **Backend**: Node.js + Express (lightweight API proxy)
- **Database**: SQLite via `better-sqlite3` (file-based, zero-config)
- **AI**: Claude API (`claude-sonnet-4-20250514`) via server-side proxy
- **Deployment**: Local dev (`npm run dev` + `npm run server`), or Vercel/Railway/Render
- **Language**: JavaScript (no TypeScript — this is a demo, keep it simple)

## Folder Structure
```
pondcheck/
├── .env                    # API key (never committed)
├── .env.example            # Template (committed)
├── package.json
├── vite.config.js
├── server/
│   ├── index.js            # Express entry point
│   ├── routes/
│   │   ├── validate.js     # POST /api/validate — Claude proxy
│   │   └── submissions.js  # GET/POST /api/submissions — SQLite CRUD
│   └── db/
│       ├── init.js         # Schema init
│       └── pondcheck.db    # Auto-created
├── src/
│   ├── main.jsx
│   ├── App.jsx             # Router: Home, Checklist, SMS View, Log
│   ├── components/
│   │   ├── HomeScreen.jsx
│   │   ├── ChecklistForm.jsx
│   │   ├── SmsView.jsx
│   │   ├── DataLog.jsx
│   │   └── PhoneMockup.jsx
│   ├── data/
│   │   └── checklists.js   # All 8 checklist definitions (fully defined)
│   ├── utils/
│   │   └── formatSubmission.js
│   └── styles/
│       └── index.css       # Tailwind + Skretting overrides
└── public/
    ├── skretting-logo.svg
    └── manifest.json
```

## Key Commands
```bash
# Terminal 1 — backend
npm run server      # node server/index.js on port 3001

# Terminal 2 — frontend
npm run dev         # Vite dev server, proxies /api to :3001

# Production
npm run build       # Vite build
```

## API Routes
| Route | Method | Purpose |
|---|---|---|
| `/api/validate` | POST | Sends checklist data to Claude, returns validation response |
| `/api/submissions` | POST | Saves a completed submission to SQLite |
| `/api/submissions` | GET | Returns last 50 submissions |
| `/api/submissions/:id` | GET | Returns a single submission |

## Application Flow
```
Home → Checklist Form → Submit
                          ↓
                    POST /api/validate  (Claude analysis)
                          ↓
                    SMS View with reply
                          ↓
                    POST /api/submissions (persist)

Home → Data Log → view past conversations
```

## Coding Conventions
- **JavaScript only** — no TypeScript, this is a demo
- Functional React components + hooks only (no class components)
- Keep components focused; extract logic to `utils/` when it helps readability
- No `any` approximation — use clear variable names and prop shapes
- Errors caught at async boundaries; surface user-friendly messages
- No unused imports, no console.log left in production paths

## Design Principles (critical — read carefully)
This app is used by field technicians standing at a shrimp pond. Design accordingly:

- **No decorative UI** — no hero sections, no gradients, no glassmorphism, no animations beyond simple transitions
- **Clean and functional** — think Linear or GitHub, not a startup landing page
- **Solid backgrounds, simple borders, clear hierarchy**
- Buttons: solid fills, 8px radius max, no pill shapes
- Cards: subtle borders, no box-shadow over 8px blur
- Inputs: solid borders, label above field, simple focus states (Skretting teal outline)
- Typography: 14–16px body, clear hierarchy, sans-serif only
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32px — use Tailwind utilities consistently
- Transitions: 100–200ms ease, opacity/colour changes only
- **Mobile-first** — primary viewport is 375px (phone or phone mockup in Chrome DevTools)
- Skretting brand colours throughout (see `docs/brand-style.md`)

## Security
- `ANTHROPIC_API_KEY` lives in `.env` only — never in frontend code, never logged
- API key proxied server-side via Express; frontend never touches it
- No auth in this demo — it is a closed demo environment
- Validate numeric inputs on the client (range checks); server trusts backend-to-Claude flow

## Checklists (8 total — all must be fully defined in `checklists.js`)
1. Water Quality — Basic
2. Water Quality — Advanced
3. Algae & Plankton Assessment
4. Shrimp Health Check
5. Feed Management
6. Pond Infrastructure
7. Mortality & Disease Observation
8. Harvest Readiness Assessment

See `dev/pondcheck-dev-spec.md` §5.2 for complete field definitions.

## Claude Prompt Behaviour
The system prompt instructs Claude to:
- Validate each field for plausibility
- Cross-validate fields against each other (e.g. low DO + high pH → algae bloom)
- Respond in a fixed format: either a clean ✓ confirmation or a ⚠ flagged list
- Keep responses concise and in plain language for a field technician

The full system prompt lives in `server/routes/validate.js`.

## Demo Script (for presenter)
1. Open at 375px width (mobile DevTools or actual phone)
2. Show Home — 8 checklists with icons
3. Submit normal values → Claude confirms all clear
4. Submit low DO (2.1) + high pH (8.8) → Claude flags anomalies
5. Open Data Log → show both submissions with status indicators

## Architecture Notes
- SQLite is the right choice here — zero config, no external service, file drops alongside the server
- Vite proxies `/api/*` to `:3001` in dev; no CORS issues
- `formatSubmission.js` converts form data to a human-readable SMS text block (not raw JSON)
- The phone mockup is a styled `div`, not a real device API
- State management is local React state — no Redux, no Zustand needed at this scale
- If Claude API is unavailable, the server returns a graceful error message shown as an incoming SMS
