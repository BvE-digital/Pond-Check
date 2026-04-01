# PondCheck — Brand Style Guide
## Based on Skretting Visual Identity

This document defines the visual and tonal standards for PondCheck. All UI decisions should reference this guide.

---

## Brand Context

PondCheck is a field tool built for Skretting, the global leader in aquaculture feed (owned by Nutreco/SHV, headquartered in Stavanger, Norway). The brand is professional, utilitarian, and science-driven. It serves experts in the field — not consumers on a marketing site.

**Parent brand tagline:** "Feeding the Future"
**Tone:** Professional. Direct. Trustworthy.

---

## Colour Palette

### Primary

| Name | Hex | Usage |
|---|---|---|
| Skretting Teal | `#00A5B5` | Primary action colour: buttons, links, active states, outgoing SMS bubbles, focus rings |
| Skretting Navy | `#1A2B4A` | Headings, primary text, nav backgrounds |
| White | `#FFFFFF` | Page backgrounds, card surfaces |

### Secondary

| Name | Hex | Usage |
|---|---|---|
| Nutreco Orange | `#E87722` | Accent only: warning states, flagged/⚠ status indicators |
| Light Grey | `#F4F5F6` | Alternate backgrounds, incoming SMS bubbles, table row stripes |
| Border Grey | `#D1D5DB` | Input borders, dividers, card borders |
| Muted Text | `#6B7280` | Secondary labels, timestamps, helper text |

### Status

| Name | Hex | Usage |
|---|---|---|
| Success Green | `#16A34A` | ✓ validated status |
| Warning Orange | `#E87722` | ⚠ flagged status (reuse Nutreco accent) |
| Error Red | `#DC2626` | Out-of-range field highlights, critical errors |

### Tailwind CSS Custom Tokens

Add to `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      teal: {
        DEFAULT: '#00A5B5',
        dark: '#008A99',
        light: '#E6F7F9',
      },
      navy: {
        DEFAULT: '#1A2B4A',
        light: '#2D4270',
      },
      orange: {
        DEFAULT: '#E87722',
        light: '#FDF0E6',
      }
    }
  }
}
```

---

## Typography

### Font Stack

Skretting.com uses a clean modern sans-serif. Match with:

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

Import Inter from Google Fonts in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page heading | 20px / 1.25rem | 700 | Navy `#1A2B4A` |
| Section heading | 16px / 1rem | 600 | Navy `#1A2B4A` |
| Body / labels | 14px / 0.875rem | 400 | Navy `#1A2B4A` |
| Secondary / meta | 12px / 0.75rem | 400 | Muted `#6B7280` |
| Button text | 14px / 0.875rem | 500 | White or Navy |

- No mixed serif/sans combinations
- No uppercase decorative text
- No eyebrow labels
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

Do not mix arbitrary pixel values outside this scale.

---

## Components

### Buttons

```
Primary:   bg-teal text-white border-none rounded-lg (8px) px-4 py-2 font-medium
           hover: bg-teal-dark
           disabled: opacity-50 cursor-not-allowed

Secondary: bg-white text-navy border border-gray-300 rounded-lg px-4 py-2 font-medium
           hover: bg-gray-50

Danger:    bg-red-600 text-white rounded-lg px-4 py-2 font-medium
```

- Max border radius: `rounded-lg` (8px) — no pill shapes (`rounded-full`)
- No gradient fills
- Transitions: `transition-colors duration-150`

### Inputs & Selects

```
border border-gray-300 rounded-md px-3 py-2 text-sm text-navy bg-white
focus: outline-none ring-2 ring-teal border-teal
```

- Label always above the field (`block text-sm font-medium text-navy mb-1`)
- Unit labels inline beside the input (`text-sm text-gray-500 ml-2`)
- Out-of-range: `border-red-500 bg-red-50` (highlight only, do not block submit)

### Cards

```
bg-white border border-gray-200 rounded-lg p-4
```

- No shadows exceeding `shadow-sm` (4px blur)
- No gradient backgrounds

### Status Badges

```
Validated: bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded
Flagged:   bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded
Pending:   bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded
```

---

## Phone Mockup (SMS View)

The phone frame simulates an SMS conversation on a mobile device.

```
Container:   w-[375px] max-w-full rounded-[2.5rem] border-4 border-navy bg-white shadow-md
Status bar:  bg-navy text-white text-xs px-6 py-2 flex justify-between (carrier, time, battery)
Header:      bg-gray-50 border-b border-gray-200 px-4 py-3 (contact name: "PondCheck AI")
Message area: bg-white flex flex-col gap-3 p-4 overflow-y-auto min-h-[300px]
```

**Outgoing bubble (technician's data):**
```
bg-teal text-white rounded-2xl rounded-br-sm px-4 py-3 ml-auto max-w-[80%] text-sm
```

**Incoming bubble (Claude response):**
```
bg-gray-100 text-navy rounded-2xl rounded-bl-sm px-4 py-3 mr-auto max-w-[80%] text-sm
```

**Timestamp:**
```
text-xs text-gray-400 text-center mt-1
```

---

## Iconography

Use **Lucide React** throughout. No other icon library.

- Size: `w-4 h-4` (16px) inline, `w-5 h-5` (20px) for cards/buttons, `w-6 h-6` (24px) for nav
- Colour: inherit from text colour or explicit `text-teal` / `text-navy`
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
| Submit button | "Submit Checklist" | "Send your amazing data ✨" |
| Validation pass | "✓ All readings within expected ranges." | "Great job! Everything looks perfect!" |
| Validation flag | "⚠ 2 items flagged for review." | "Uh oh! Something went wrong." |
| Loading state | "Analysing…" | "Our AI is thinking hard for you…" |
| Empty log | "No submissions yet." | "Wow, so empty here!" |
| Error state | "Validation unavailable. Data saved locally." | "Something broke. Please try again later." |

### Claude Response Tone

Claude's SMS responses should match this voice: concise, factual, actionable. No preamble, no filler, no cheerful affirmations. See the system prompt in `server/routes/validate.js` for the exact format.

---

## Layout & Responsive Behaviour

- **Primary target**: 375px viewport (mobile-first)
- **Secondary**: 768px+ (tablet/desktop for demo on a laptop)
- Use `max-w-sm mx-auto` containers for form views to constrain width on large screens
- Navigation: simple top bar with logo left, nav links right (collapse to hamburger only if needed)
- No sidebar layouts — single column on mobile is the default

---

## What to Avoid

- No gradients (`bg-gradient-*`)
- No glassmorphism (`backdrop-blur`, semi-transparent cards)
- No large decorative shadows (`shadow-xl`, `shadow-2xl`)
- No hero sections or full-screen backgrounds
- No pill-shaped buttons
- No animation libraries (Framer Motion etc.) — CSS transitions only
- No mixed fonts (Inter only)
- No decorative dividers, ornamental copy, or emoji in UI labels
- No dark mode (not needed for this demo)
