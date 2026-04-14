# PondCheck — Brand Style Guide
## Based on Skretting Visual Identity (sourced from skretting.com CSS)

This document defines the visual and tonal standards for PondCheck. All UI decisions should reference this guide.

---

## Brand Context

PondCheck is a field tool built for Skretting, the global leader in aquaculture feed (owned by Nutreco/SHV, headquartered in Stavanger, Norway). The brand is professional, utilitarian, and science-driven. It serves experts in the field — not consumers on a marketing site.

**Parent brand tagline:** "Feeding the Future"
**Tone:** Professional. Direct. Trustworthy.

---

## Colour Palette

All values sourced from `skretting.com` CSS design tokens (`--brand__color--*`).

### Core Brand

| Token | Hex | CSS Variable | Usage |
|---|---|---|---|
| Skretting Red | `#C8102E` | `--brand__color--primary` | Brand primary — header accent bar, PondCheck label, flagged states |
| Skretting Red Dark | `#A50E25` | — | Red hover state |
| Skretting Red Soft | `#FFECEB` | `--brand__color--softred` | Warning background tint |
| Skretting Navy | `#001F3B` | `--brand__color--deepred` (AQV) | Deepest text, phone frame, headings |

### Aquaculture (AQV) Action Colours

| Token | Hex | CSS Variable | Usage |
|---|---|---|---|
| Skretting Teal | `#007D8A` | — | Primary interactive: buttons, focus rings, outgoing SMS |
| Skretting Teal Dark | `#004F57` | — | Teal hover state |
| Skretting Teal Soft | `#E6F4F5` | — | Icon backgrounds, subtle tints |

### Neutral / UI

| Token | Hex | CSS Variable | Usage |
|---|---|---|---|
| Light Grey | `#F2F2F3` | `--brand__color--softgrey` | Page background |
| Border Grey | `#D0D0D1` | `--brand__color--grey` | Input borders, dividers, card borders |
| Muted Text | `#84888B` | `--brand__color--deepgrey` | Secondary labels, timestamps, helper text |
| White | `#FFFFFF` | `--brand__color--white` | Card surfaces, header background |

### Status

| Name | Hex | Usage |
|---|---|---|
| Success Green | `#4D9951` | `--brand__color--accent-green-400` — ✓ validated status |
| Warning Orange | `#F87527` | `--brand__color--accent-orange-400` — out-of-range warnings |
| Error Red | `#C8102E` | Brand red — flagged submission badges |

### Tailwind CSS Custom Tokens (`tailwind.config.js`)

```javascript
colors: {
  'skretting-red':        '#C8102E',
  'skretting-red-dark':   '#A50E25',
  'skretting-red-soft':   '#FFECEB',
  'skretting-teal':       '#007D8A',
  'skretting-teal-dark':  '#004F57',
  'skretting-teal-soft':  '#E6F4F5',
  'skretting-navy':       '#001F3B',
  'skretting-light':      '#F2F2F3',
  'skretting-border':     '#D0D0D1',
  'skretting-muted':      '#84888B',
}
```

---

## Typography

Sourced from `skretting.com` CSS (`font-family` declarations).

### Font Stack

**Headings** — Skretting uses `Sitka Banner` (Windows serif), Georgia as fallback:
```css
font-family: 'Sitka Banner', Georgia, serif;
```

**Body / UI** — Skretting uses Arial as their primary body font:
```css
font-family: Arial, system-ui, -apple-system, 'Helvetica Neue', sans-serif;
```

No web font imports needed — these are system fonts.

### Type Scale

| Role | Size | Weight | Font | Colour |
|---|---|---|---|---|
| Page heading (h1) | 18px / 1.125rem | 400 | Serif | Navy `#001F3B` |
| Section heading (h2) | 16px / 1rem | 600 | Serif | Navy `#001F3B` |
| Body / labels | 14px / 0.875rem | 400 | Sans | Navy `#001F3B` |
| Secondary / meta | 12px / 0.75rem | 400 | Sans | Muted `#84888B` |
| Button text | 14px / 0.875rem | 500 | Sans | White or Navy |

- No uppercase decorative text
- Line height: 1.5 for body, 1.25 for headings

---

## Spacing

Use a consistent 4px base scale. Tailwind utilities:

| Token | px | Tailwind class |
|---|---|---|
| xs | 4px | `p-1`, `gap-1` |
| sm | 8px | `p-2`, `gap-2` |
| md | 12px | `p-3`, `gap-3` |
| base | 16px | `p-4`, `gap-4` |
| lg | 24px | `p-6`, `gap-6` |
| xl | 32px | `p-8`, `gap-8` |

---

## Components

### Page Header

```
bg-white border-b-2 border-skretting-red sticky top-0 z-10
```
- White background with `2px` solid red bottom border — the Skretting brand signature
- Logo left, secondary nav right
- "PondCheck" label in `text-skretting-red`
- Back buttons in `text-skretting-muted hover:text-skretting-navy`

### Buttons

```
Primary:   bg-skretting-teal text-white rounded-lg (8px) px-4 py-2 font-medium
           hover: bg-skretting-teal-dark
           disabled: opacity-50 cursor-not-allowed

Secondary: bg-white text-skretting-navy border border-skretting-border rounded-lg px-4 py-2
           hover: bg-skretting-light
```

- Border radius: `rounded-lg` (8px — matches `--brand__border-radius: 8px`)
- No pill shapes, no gradient fills
- Transitions: `transition-colors duration-150`

### Inputs & Selects

```
border border-skretting-border rounded-md px-3 py-2 text-sm text-skretting-navy bg-white
focus: ring-2 ring-skretting-teal border-skretting-teal
warning: border-amber-400 bg-amber-50
```

- Label always above the field
- Out-of-range: amber warning (not red — red is for flagged/error)

### Cards

```
bg-white border border-skretting-border rounded-lg
```

- No shadows exceeding `shadow-sm`
- No gradient backgrounds
- Checklist card hover: `hover:border-skretting-teal`

### Status Badges

```
Clear:   bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded
Flagged: bg-skretting-red-soft text-skretting-red text-xs font-medium px-2 py-0.5 rounded
Pending: bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded
```

---

## Phone Mockup (SMS View)

```
Frame:        border-2 border-skretting-navy rounded-[2.5rem] bg-white shadow-md
Status bar:   bg-skretting-navy text-white
Contact bar:  bg-skretting-navy border-b border-gray-700
Message area: bg-skretting-light
```

**Outgoing bubble (technician's data):**
```
bg-skretting-teal text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl px-4 py-3
```

**Incoming bubble (Claude response):**
```
bg-white text-skretting-navy border border-skretting-border rounded-tr-2xl rounded-bl-sm rounded-br-2xl
```

---

## Iconography

Use **Lucide React** throughout. No other icon library.

- Size: `w-4 h-4` (16px) inline, `w-5 h-5` (20px) for cards/buttons
- Icon containers on checklist cards: `bg-skretting-teal-soft` with `text-skretting-teal`
- Header icons: `text-skretting-red` (brand accent)
- Stroke width: default (1.5px)

Checklist icon mapping:
| Checklist | Icon |
|---|---|
| Water Quality — Basic | `Droplets` |
| Water Quality — Advanced | `FlaskConical` |
| Algae & Plankton | `Microscope` |
| Shrimp Health | `Activity` |
| Feed Management | `Scale` |
| Pond Infrastructure | `Wrench` |
| Mortality & Disease | `AlertTriangle` |
| Harvest Readiness | `BarChart2` |

---

## Tone of Voice

### Principles

- **Professional, not corporate** — speak like a knowledgeable colleague, not a brochure
- **Direct and actionable** — tell the user what is wrong and what to do
- **No jargon beyond aquaculture norms** — technicians know their domain
- **No marketing language** — this is a tool, not a product page

### UI Copy Examples

| Context | Do | Don't |
|---|---|---|
| Submit button | "Submit Inspection" | "Send your amazing data ✨" |
| Validation pass | "✓ All readings within expected ranges." | "Great job! Everything looks perfect!" |
| Validation flag | "⚠ 2 items flagged for review." | "Uh oh! Something went wrong." |
| Loading state | "Analysing…" | "Our AI is thinking hard for you…" |
| Empty log | "No submissions yet." | "Wow, so empty here!" |
| Error state | "Validation unavailable. Data saved locally." | "Something broke. Please try again later." |

---

## Layout & Responsive Behaviour

- **Primary target**: 375px viewport (mobile-first)
- **Secondary**: 768px+ (tablet/desktop for demo on a laptop)
- `max-w-2xl mx-auto` for home/log views, `max-w-lg mx-auto` for form/SMS views
- Single column on mobile is the default

---

## What to Avoid

- No gradients (`bg-gradient-*`)
- No glassmorphism (`backdrop-blur`, semi-transparent cards)
- No large decorative shadows (`shadow-xl`, `shadow-2xl`)
- No hero sections or full-screen backgrounds
- No pill-shaped buttons
- No animation libraries — CSS transitions only
- No web font imports — use system fonts (Arial / Sitka Banner / Georgia)
- No dark mode
