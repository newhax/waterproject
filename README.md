# 💧 JalMitra — Understand. Save. Fix.

A mobile-first water sustainability platform for Indian cities (default: **Jaipur, Rajasthan**).

| Tab | What it does |
|---|---|
| **Rainwater Estimator** (Save) | Draw your roof on a satellite map. It averages the last 5 years of rainfall and gives you the yearly harvest, a tank size based on the dry season, cost, savings, payback and a PDF report. |
| **Quality Reporter** (Fix) | Photograph a leak, sewage overflow or dirty water. AI classifies the issue and its severity, then drafts a formal complaint in English or Hindi. Reports appear on a public map with a heatmap, upvotes and a status flow. |
| **Water Footprint** (Understand) | Type in your meals and chores, or upload a meal photo. It shows the hidden litres behind them, a breakdown donut, a comparison with the Indian average, and 3 swaps that save water. |
| **/admin** | Municipal dashboard: total reports, % resolved, hotspots by area, issues by type, and status updates. |

**Demo mode** (the toggle in the top bar) runs everything on sample data, cached Jaipur rainfall and simulated AI, so the demo works without any API keys.

---

## Quick start

Requires **Node.js 20+** ([nodejs.org](https://nodejs.org)).

```bash
npm install
cp .env.example .env      # optional – the app runs in Demo mode without it
npm run dev               # http://localhost:5173
```

`npm run dev` also serves `/api/analyze` locally, using a small Vite plugin in `vite.config.js`. You don't need `vercel dev`.

To test at **375px**, open Chrome DevTools, switch on the device toolbar and pick iPhone SE or set 375 × 667.

> **Testing on a real phone:** GPS and some browser features only work over **HTTPS** (or on localhost). Opening `http://192.168.x.x:5173` on a phone won't give you GPS. Use the Vercel deployment, or a tunnel such as `npx cloudflared tunnel --url http://localhost:5173`.

## Environment variables

| Variable | Where it's used | Required | Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | browser | no | Supabase project URL. Without it, reports are stored in the browser. |
| `VITE_SUPABASE_ANON_KEY` | browser | no | Supabase **anon** (public) key. |
| `VITE_ADMIN_PASSWORD` | browser | no | Password for `/admin`. Defaults to `jalmitra2026`. It's a demo gate, **not** real security. |
| `ANTHROPIC_API_KEY` | **server only** | for real AI | Read only by `api/analyze.js`. Never prefix it with `VITE_`, or it will be shipped to the browser. |
| `ANALYZE_MODEL` | server only | no | Defaults to `claude-opus-5-5`. |

Each mode needs:

| Mode | Rainfall | AI | Reports |
|---|---|---|---|
| Demo (toggle on) | bundled Jaipur normals | simulated | browser storage |
| Live, no Supabase | Open-Meteo | Claude (needs `ANTHROPIC_API_KEY`) | browser storage |
| Live + Supabase | Open-Meteo | Claude | Supabase (shared by everyone) |

Every live call has a fallback. If Open-Meteo is down, the bundled normals are used and a banner says so. If the AI fails, the Reporter shows a manual issue-type dropdown and the Footprint tab uses its offline text matcher. If Supabase fails, reports are saved on the device with a warning.

## Supabase setup (optional, about 5 minutes)

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, paste and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `reports` table, access rules, the database functions for upvotes, status changes and seeding, and a public `report-images` storage bucket for photos.
3. In **Project Settings → API**, copy the Project URL and the `anon` key into `.env`.
4. Restart `npm run dev`, switch the toggle to **Live**, open `/admin` and click **Load sample reports into Supabase**.

> Security note: this setup is fine for a hackathon. Anyone holding the public anon key can create reports, upvote and change status. Before real use, move status changes behind Supabase Auth and enforce them with access rules (RLS).

## AI setup

1. Get an API key at [platform.claude.com](https://platform.claude.com) and set `ANTHROPIC_API_KEY`.
2. `api/analyze.js` calls Claude with **structured JSON output**, so the response always matches the schema:
   - `mode: "report"` → `{ issue_type, severity, description, suggested_action }`
   - `mode: "footprint"` → `{ items: [{ id, label, quantity }] }`, mapped to the IDs in `water-footprint.json`
3. If the model declines a request, Anthropic's server-side fallback retries it on another model. To turn this off, remove `betas` and `fallbacks` from the request.
4. Photos are shrunk to about 1280px JPEG in the browser before upload, which keeps requests small and under Vercel's 4.5 MB body limit.

Every AI result in the UI is labelled **"AI-estimated from photo, not lab-verified"**.

## Deploy to Vercel

**Dashboard**
1. Push this folder to a GitHub repo.
2. In [vercel.com/new](https://vercel.com/new), import the repo. The framework is detected as **Vite**: build `npm run build`, output `dist`.
3. Under **Settings → Environment Variables**, add the variables from the table above.
4. Deploy. `api/analyze.js` becomes a serverless function automatically. `vercel.json` sets its time limit to 60 s and sends all page routes such as `/admin` to the app.

**CLI**
```bash
npm i -g vercel
vercel              # first run links the project (preview deploy)
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

## How the numbers work

**Rainwater** (`src/lib/harvest.js`, constants in `src/lib/config.js`)
- Rainfall: Open-Meteo archive, daily rainfall for the last 5 full years, totalled by month and averaged.
- Harvest (L) = rainfall (mm) × roof area (m²) × runoff coefficient (concrete 0.85, tile 0.80, metal 0.90).
- Dry months are those averaging under 20 mm. Tank = daily demand × dry days, where daily demand is 135 L per person per day (the CPHEEO norm) or 10 L for drinking and cooking only. The tank is never bigger than the yearly harvest.
- Cost = base installation + piping per m² + tank (HDPE ₹8/L up to 5,000 L, an underground sump at ₹3.5/L beyond that). These are indicative 2026 rates, so edit `HARVEST_COSTS` for your city.
- Savings = harvested water you would otherwise buy (up to the household's full yearly need) × the tanker rate. Payback = cost ÷ yearly savings.

**Footprint** (`src/data/water-footprint.json`)
- 68 items, each with litres per unit, whether the water is hidden (virtual) or used directly, alternative spellings and a source note.
- Most figures are Water Footprint Network world averages (Mekonnen & Hoekstra 2010/2011) × typical Indian portions. A few are marked "estimate".
- India average 2,980 L/day and world average 3,795 L/day come from Hoekstra & Mekonnen (2012), PNAS.

## Project structure

```
api/analyze.js                 Serverless AI endpoint (report + footprint modes)
supabase/schema.sql            Table, RLS, RPCs, storage bucket
src/
  main.jsx, App.jsx, index.css Entry, lazy routes, Tailwind layers
  components/
    layout/                    Navbar (top on desktop / bottom tabs on mobile), Layout, DemoToggle
    ui/                        Skeleton, EmptyState, PageHeader, Segmented, Stepper, Logo, ErrorBoundary
    rainwater/                 RoofMap (leaflet-draw), RainChart, ResultsCards
    reporter/                  ReportForm, PhotoPicker, LocationPickerMap, ReviewPanel,
                               ComplaintLetter, CommunityMap, ReportsMap (heatmap), Badges, UpvoteButton
    footprint/                 FootprintInput, ItemsEditor, BreakdownDonut, Comparison, SwapSuggestions
  pages/                       Home, Rainwater, Reporter, Footprint, Admin
  lib/
    config.js                  City, costs, coefficients, demand norms
    demoMode.jsx               Demo/live context
    supabase.js                Client (null when not configured)
    rainfall.js, harvest.js    Open-Meteo + RWH maths
    analyze.js                 /api/analyze client + offline mock
    reports.js, useReports.js  Report store (Supabase ↔ localStorage) + React hook
    letter.js                  EN/HI complaint letters, copy, mailto, Hindi print-to-PDF
    pdf.js                     jsPDF reports and letters
    footprint.js               Catalog lookup, offline text parser, swaps
    geo.js, image.js, format.js, issueTypes.js, leafletSetup.js
  data/
    jaipurRainfall.json        Offline monthly normals
    seedReports.js             30 sample Jaipur reports + area lookup
    water-footprint.json       68 items, sources, swaps
```

## Known limitations

- **Map tiles and fonts need the internet.** Demo mode removes the dependence on APIs and keys, not on the network. If venue Wi-Fi is unreliable, open each tab once beforehand so the tiles are cached, or use a phone hotspot.
- **Hindi PDF:** jsPDF can't lay out Devanagari correctly (letters that join or carry vowel marks break apart), so the Hindi letter opens a print-ready page. Choose "Save as PDF" there.
- **Roof drawing on phones:** leaflet-draw 1.0.4 can be fiddly with touch on recent Leaflet versions. Typing in the roof area always works.
- **Recipients:** official email addresses are not built in. Add the right PHED or Municipal Corporation address in your mail app.
- The `/admin` password is checked in the browser only, which is fine for a demo but not real security.
