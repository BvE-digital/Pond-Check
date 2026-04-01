# PondCheck: Development Specification
## Skretting Field Data Capture Demo — PWA + Simulated SMS + Claude Validation

---

## 1. Purpose

Build a working web-based demo that showcases the full PondCheck workflow:

1. A field technician opens a PWA on their phone, selects a checklist, fills in structured fields
2. On submission, a simulated SMS is sent (visualised as an in-app SMS conversation, not actual telephony)
3. Claude analyses the submitted data for cross-field plausibility and returns a validation response
4. The SMS conversation shows the system's reply: either confirmation or a request to recheck specific values

The demo must feel production-ready. It is designed for a senior leadership audience at Skretting/Nutreco.

---

## 2. Tech Stack & Project Structure

### Stack
- **Frontend:** React (Vite), Tailwind CSS, Lucide React icons
- **Backend:** Node.js + Express (lightweight API proxy for Claude)
- **Database:** SQLite via better-sqlite3 (zero-config, file-based, no external services)
- **AI:** Claude API (Anthropic) via server-side proxy
- **Deployment:** Local dev server or deploy to Vercel/Railway/Render

### Project structure

```
pondcheck/
├── .env                          # API key lives here
├── .env.example                  # Template (committed to repo)
├── package.json
├── vite.config.js
├── server/
│   ├── index.js                  # Express server
│   ├── routes/
│   │   ├── validate.js           # POST /api/validate — Claude API proxy
│   │   └── submissions.js        # GET/POST /api/submissions — SQLite CRUD
│   └── db/
│       ├── init.js               # SQLite schema initialisation
│       └── pondcheck.db          # Auto-created on first run
├── src/
│   ├── main.jsx
│   ├── App.jsx                   # Router: Home, Checklist, SMS View, Log
│   ├── components/
│   │   ├── HomeScreen.jsx        # Checklist grid
│   │   ├── ChecklistForm.jsx     # Dynamic form renderer
│   │   ├── SmsView.jsx           # Phone mockup with SMS conversation
│   │   ├── DataLog.jsx           # Submission history table
│   │   └── PhoneMockup.jsx       # Reusable phone frame component
│   ├── data/
│   │   └── checklists.js         # All 8 checklist definitions
│   ├── utils/
│   │   └── formatSubmission.js   # Convert form data to readable SMS text
│   └── styles/
│       └── index.css             # Tailwind directives + Skretting overrides
├── public/
│   ├── skretting-logo.svg        # Skretting wordmark
│   └── manifest.json             # PWA manifest
└── README.md
```

### Environment configuration

**.env** (never committed):
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=3001
```

**.env.example** (committed):
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

---

## 3. Brand & Visual Identity

### Reference
Pull colours, typography, and tone from [skretting.com](https://www.skretting.com). Visit the site and inspect/extract the exact values.

### Extracted brand elements

| Element | Value |
|---|---|
| Primary colour | Skretting teal/green (#00A5B5 approximate; extract precisely from the site) |
| Secondary colour | Dark navy (#1A2B4A approximate) |
| Accent | Warm orange from Nutreco palette |
| Logo | Skretting wordmark (download SVG from site, place in `/public/`) |
| Typography | Use the font stack from skretting.com. Likely a clean sans-serif. Match it exactly or use a close equivalent from Google Fonts |
| Tone | Professional, clean, utilitarian. This is a field tool, not a marketing site |

### Design principles (read carefully)

This is a tool for field technicians standing at a shrimp pond. Design accordingly:

- No hero sections, no gradients, no glassmorphism, no decorative elements
- Clean, functional UI. Think Linear or GitHub, not a startup landing page
- Solid backgrounds, simple borders, clear hierarchy
- Buttons: solid fills, 8px radius max, no pill shapes
- Cards: simple containers, subtle borders, no shadows over 8px blur
- Inputs: solid borders, clear labels above fields, simple focus states
- Typography: 14-16px body, clear hierarchy, no mixed serif/sans combos
- Spacing: consistent 4/8/12/16/24/32px scale
- Transitions: 100-200ms ease, simple opacity/colour changes only
- No eyebrow labels, no uppercase decorative text, no ornamental copy
- Mobile-first layout (this will be shown on a phone or in a phone mockup)

---

## 4. Backend

### 4.1 Express Server (`server/index.js`)

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateRoute } from './routes/validate.js';
import { submissionsRoute } from './routes/submissions.js';
import { initDb } from './db/init.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

initDb();

app.use('/api/validate', validateRoute);
app.use('/api/submissions', submissionsRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`PondCheck API running on port ${PORT}`));
```

### 4.2 Claude Proxy Route (`server/routes/validate.js`)

This route receives checklist data from the frontend, calls the Claude API server-side (keeping the API key secure), and returns Claude's response.

```javascript
import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

const SYSTEM_PROMPT = `...`; // See section 7 for full prompt

router.post('/', async (req, res) => {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: SYSTEM_PROMPT + '\n\nChecklist submission:\n' + JSON.stringify(req.body, null, 2)
        }
      ]
    });

    const responseText = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    res.json({ response: responseText });
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ 
      response: 'System unavailable. Your data has been saved locally and will be validated when connectivity is restored.' 
    });
  }
});

export { router as validateRoute };
```

### 4.3 Submissions Route (`server/routes/submissions.js`)

CRUD operations for storing and retrieving checklist submissions.

```javascript
import { Router } from 'express';
import { getDb } from '../db/init.js';

const router = Router();

router.post('/', (req, res) => {
  const db = getDb();
  const { checklistId, checklistName, pondId, data, status, claudeResponse } = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO submissions (checklist_id, checklist_name, pond_id, data, status, claude_response, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  
  const result = stmt.run(checklistId, checklistName, pondId, JSON.stringify(data), status, claudeResponse);
  res.json({ id: result.lastInsertRowid });
});

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 50').all();
  res.json(rows.map(row => ({ ...row, data: JSON.parse(row.data) })));
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json({ ...row, data: JSON.parse(row.data) });
});

export { router as submissionsRoute };
```

### 4.4 Database Schema (`server/db/init.js`)

```javascript
import Database from 'better-sqlite3';
import path from 'path';

let db;

export function initDb() {
  db = new Database(path.join(import.meta.dirname, 'pondcheck.db'));
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      checklist_id TEXT NOT NULL,
      checklist_name TEXT NOT NULL,
      pond_id TEXT NOT NULL,
      data TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      claude_response TEXT,
      submitted_at TEXT NOT NULL
    )
  `);
  
  return db;
}

export function getDb() {
  if (!db) initDb();
  return db;
}
```

---

## 5. Frontend

### 5.1 Application Flow

```
[Home Screen] → [Checklist Form] → [Submission + SMS View]
                                         ↓
                                   POST /api/validate
                                         ↓
                                   [SMS Reply appears]
                                         ↓
                                   POST /api/submissions (save)

[Home Screen] → [Data Log] → [View past SMS conversation]
```

Use React Router or simple state-based navigation. Either approach is fine.

### 5.2 Home Screen (`HomeScreen.jsx`)

Display a grid or list of available checklists. Each item shows:
- Checklist name
- Brief description (one line)
- Icon (Lucide React)
- Number of fields

#### Checklists to include (8 total):

**1. Water Quality — Basic**
Fields: pond ID (text), date (date), time (time), temperature °C (decimal, range 20-35), dissolved oxygen mg/L (decimal, range 0-20), pH (decimal, range 6.0-9.5), salinity ppt (decimal, range 0-45), transparency/Secchi depth cm (integer, range 5-100)

**2. Water Quality — Advanced**
Fields: pond ID, date, ammonia NH3 mg/L (decimal, range 0-5), nitrite NO2 mg/L (decimal, range 0-10), nitrate NO3 mg/L (decimal, range 0-200), alkalinity mg/L CaCO3 (integer, range 50-300), hardness mg/L (integer, range 50-500), hydrogen sulphide mg/L (decimal, range 0-1)

**3. Algae & Plankton Assessment**
Fields: pond ID, date, dominant algae species (dropdown: Chaetoceros, Skeletonema, Thalassiosira, Chlorella, Oscillatoria, Microcystis, Mixed, Other), algae density cells/mL (integer, range 1000-5000000), water colour (dropdown: green, brown, yellow-green, blue-green, dark green, clear, turbid), bloom status (dropdown: absent, developing, stable, declining, crash), zooplankton presence (dropdown: abundant, moderate, low, absent)

**4. Shrimp Health Check**
Fields: pond ID, date, sample size (integer), average body weight g (decimal, range 0.1-50), estimated survival % (integer, range 0-100), gut fullness (dropdown: full, 3/4, 1/2, 1/4, empty), body colour (dropdown: normal, pale, dark, red, blue), antenna condition (dropdown: intact, broken, missing tips), gill condition (dropdown: clean, slightly fouled, heavily fouled, black)

**5. Feed Management**
Fields: pond ID, date, feed type (text), daily feed amount kg (decimal), feeding frequency per day (integer, range 1-6), feed conversion ratio estimate (decimal, range 0.5-3.0), feed tray observation (dropdown: empty within 2h, some remaining, mostly remaining, untouched), adjustment recommendation (dropdown: increase 10%, maintain, decrease 10%, decrease 20%, stop feeding)

**6. Pond Infrastructure**
Fields: pond ID, date, aerator status (dropdown: all operational, partial failure, major failure), aerator count operational (integer, range 0-20), water inlet condition (dropdown: good, partial blockage, blocked, damaged), water outlet condition (dropdown: good, partial blockage, blocked, damaged), pond bank condition (dropdown: intact, minor erosion, significant erosion, breach risk), screen/net condition (dropdown: intact, minor damage, needs replacement)

**7. Mortality & Disease Observation**
Fields: pond ID, date, estimated daily mortality count (integer, range 0-10000), mortality pattern (dropdown: scattered, near aerators, near inlet, at surface, at bottom, along banks), observed symptoms (multi-select: lethargy, erratic swimming, surface crawling, loose shell, white spots, black spots, red colouration, soft shell, luminescence, none), moribund shrimp observed (dropdown: yes, no), sample collected for lab (dropdown: yes, no, not needed)

**8. Harvest Readiness Assessment**
Fields: pond ID, date, days of culture (integer, range 1-180), average body weight g (decimal, range 5-50), target harvest weight g (decimal, range 15-45), estimated biomass kg (decimal, range 100-30000), estimated survival % (integer, range 0-100), market price per kg local currency (decimal), recommendation (dropdown: harvest now, wait 1 week, wait 2 weeks, requires review)

### 5.3 Checklist Form View (`ChecklistForm.jsx`)

When a checklist is selected, render a form with:
- Checklist title at the top
- Pond ID and date pre-populated (date = today)
- Each field rendered according to its type:
  - `decimal` / `integer`: number input with step, min, max, and unit label beside the input
  - `text`: text input
  - `date` / `time`: native date/time picker
  - `dropdown`: select element with options
  - `multi-select`: checkbox group
- Required field indicators (asterisk or similar)
- A "Submit" button at the bottom, disabled until all required fields are filled

**Client-side validation:**
- Range checks on numeric fields (highlight border in red/orange if out of range, but allow submission; the rep may have a genuine outlier)
- Required field check before enabling submit

### 5.4 SMS Conversation View (`SmsView.jsx` + `PhoneMockup.jsx`)

On submit:

1. Convert the form data to a readable summary
2. Show a **phone mockup** (a styled container that looks like a mobile phone screen showing an SMS conversation)
3. Display the outgoing message as a summary from the user (right-aligned bubble, Skretting teal)
4. Show a typing indicator / loading animation
5. POST to `/api/validate` with the checklist data
6. Display Claude's response as an incoming SMS (left-aligned bubble, light grey)
7. POST to `/api/submissions` to save the complete record (including Claude's response)

#### Phone mockup design:
- Rounded rectangle container with a border and subtle shadow, simulating a phone screen
- Top bar showing carrier name "Skretting Net", current time, battery icon
- Contact name: "PondCheck AI"
- SMS bubbles: outgoing (Skretting teal background, white text, right-aligned) and incoming (light grey background, dark text, left-aligned)
- Timestamp under each message
- The outgoing message should show a condensed, readable version of the submission (not raw JSON):
  ```
  Pond: E-14
  Water Quality — Basic
  Temp: 28.5°C | DO: 3.2 mg/L
  pH: 7.8 | Salinity: 25 ppt
  Secchi: 35 cm
  ```
- The incoming message shows Claude's analysis
- A "Back to checklists" button below the phone mockup

### 5.5 Data Log (`DataLog.jsx`)

A table showing all submissions stored in SQLite. Fetched from `GET /api/submissions`.

Columns: timestamp, pond ID, checklist type, status (OK / flagged), action button to view the SMS conversation.

Accessible from the home screen via a "History" or "Submissions" link.

---

## 6. Checklist Data Model (`src/data/checklists.js`)

```javascript
export const CHECKLISTS = {
  'water-quality-basic': {
    id: 'water-quality-basic',
    name: 'Water Quality — Basic',
    description: 'Core water parameters for daily monitoring',
    icon: 'Droplets',
    fields: [
      {
        id: 'pond_id',
        label: 'Pond ID',
        type: 'text',
        required: true,
        placeholder: 'e.g. E-14'
      },
      {
        id: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        defaultToday: true
      },
      {
        id: 'time',
        label: 'Time',
        type: 'time',
        required: true
      },
      {
        id: 'temperature',
        label: 'Temperature',
        type: 'decimal',
        unit: '°C',
        min: 20,
        max: 35,
        step: 0.1,
        required: true
      },
      {
        id: 'dissolved_oxygen',
        label: 'Dissolved Oxygen',
        type: 'decimal',
        unit: 'mg/L',
        min: 0,
        max: 20,
        step: 0.1,
        required: true
      },
      {
        id: 'ph',
        label: 'pH',
        type: 'decimal',
        unit: '',
        min: 6.0,
        max: 9.5,
        step: 0.1,
        required: true
      },
      {
        id: 'salinity',
        label: 'Salinity',
        type: 'decimal',
        unit: 'ppt',
        min: 0,
        max: 45,
        step: 0.5,
        required: true
      },
      {
        id: 'secchi_depth',
        label: 'Secchi Depth (Transparency)',
        type: 'integer',
        unit: 'cm',
        min: 5,
        max: 100,
        required: true
      }
    ]
  },
  // ... Define remaining 7 checklists following the same structure
  // Use the field specifications from section 5.2
};
```

All 8 checklists must be fully defined in this file. Do not leave placeholders or comments like "add remaining checklists here".

---

## 7. Claude System Prompt

Store this in `server/routes/validate.js` as a constant.

```
You are an aquaculture field data validation system for Skretting, the global leader in shrimp and fish feed. A technical representative has submitted a pond inspection checklist. Your job is to:

1. Check each value for plausibility within its expected range
2. Cross-validate values against each other for consistency
3. Flag any anomalies or concerning patterns

Domain knowledge you should apply:
- Dissolved oxygen below 4 mg/L is stressful for shrimp; below 2 mg/L is critical
- pH outside 7.5-8.5 range is concerning for shrimp ponds
- High algae density (>500,000 cells/mL) should correlate with low Secchi depth (<30cm) and green/dark water colour
- Low Secchi depth with low algae count suggests suspended sediment, not algae bloom
- Ammonia above 0.1 mg/L at pH >8.5 is toxic (un-ionised fraction increases with pH)
- Feed conversion ratio above 2.0 suggests overfeeding or health issues
- Empty feed trays with high mortality suggest disease, not underfeeding
- Survival below 60% at harvest is economically concerning
- Temperature above 33°C causes severe stress
- Salinity and alkalinity should be roughly correlated in marine shrimp ponds
- Blue-green algae (Oscillatoria, Microcystis) at high density indicates poor water quality
- Luminescence in shrimp strongly suggests Vibrio infection

Respond in this exact format:

If no anomalies:
"✓ Checklist received for Pond [ID]. All readings within expected ranges. No anomalies detected. Data recorded at [time]."

If anomalies found:
"⚠ Checklist received for Pond [ID]. [N] item(s) flagged for review:

• [Field name]: [value] — [brief explanation of concern and what to check]
• [Field name]: [value] — [brief explanation]

Recommended action: [one sentence summary of what the rep should do next]"

Keep responses concise. Maximum 4-5 flagged items. Prioritise the most critical issues. Use simple, direct language suitable for a field technician.
```

---

## 8. Running the Application

### Prerequisites
- Node.js 18+
- An Anthropic API key

### Setup
```bash
cd pondcheck
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Development
```bash
# Terminal 1: Start the backend
npm run server

# Terminal 2: Start the frontend
npm run dev
```

### Package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "server": "node server/index.js",
    "build": "vite build",
    "start": "node server/index.js"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.383.0",
    "@anthropic-ai/sdk": "latest",
    "express": "^4",
    "cors": "^2",
    "better-sqlite3": "^11",
    "dotenv": "^16"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

### Vite proxy config (`vite.config.js`)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

---

## 9. Demo Script (for presenter)

1. Open the app in a browser (ideally in mobile-width Chrome DevTools, or on an actual phone pointing to the local server).
2. Show the home screen with 8 checklists.
3. Select "Water Quality — Basic". Fill in Pond E-14 with normal values: temp 29°C, DO 6.5 mg/L, pH 8.0, salinity 28 ppt, Secchi 40 cm.
4. Submit. The SMS conversation appears. Claude responds: all clear.
5. Go back. Select "Water Quality — Basic" again. Enter concerning values: temp 29°C, DO 2.1 mg/L (critically low), pH 8.8 (high), salinity 28 ppt, Secchi 15 cm (low).
6. Submit. Claude flags DO and pH as concerning, notes that low Secchi with high pH suggests algae bloom, recommends emergency aeration and reducing feed.
7. Open the Data Log. Show both submissions with status indicators.

This demonstrates: structured input, domain-aware AI validation, real-time feedback via simulated SMS, and persistent data storage.

---

## 10. What This Is NOT

- This is not a production application
- This does not send real SMS messages
- This does not include user authentication
- This is a demo for a leadership audience to validate the concept before committing to a full build

---

## 11. Acceptance Criteria

- [ ] Home screen displays 8 checklists with icons and descriptions
- [ ] Each checklist opens a form with correctly typed fields (number, dropdown, multi-select, date)
- [ ] Client-side range validation highlights out-of-range values without blocking submission
- [ ] Submit button generates a readable summary in the SMS view
- [ ] Backend proxies the Claude API call securely (key in .env, never exposed to frontend)
- [ ] Claude's response appears as an incoming SMS in the phone mockup
- [ ] Submissions are persisted to SQLite and viewable in the Data Log
- [ ] Data Log shows timestamp, pond ID, checklist type, status, and links to view past conversations
- [ ] Mobile-responsive layout (primary target: 375px viewport)
- [ ] Skretting brand colours and typography applied throughout
- [ ] SMS phone mockup looks realistic and polished
- [ ] App runs with `npm run dev` + `npm run server` after adding API key to .env
