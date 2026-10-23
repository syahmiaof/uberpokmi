# UberPokmi

An interactive, frontend-only Malaysian mobility superapp demo. Book a fictional ride, order from a fictional restaurant, or send a fictional parcel; advance its simulated status and find the result in Activity. No backend, account login, real payment, dispatch, GPS, or live messages are connected.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173/`.

```sh
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

The test suite covers booking and tracking across all three services, discounts, scheduling, cart replacement, saved addresses, reset, keyboard focus, map fallback, and responsive widths from 375px to 1920px. Tests use local state and a fresh browser context. If another service occupies port 5173, run the app on 5173 before E2E tests or update `playwright.config.ts`.

## Explore the demo

- **Ride:** Choose two different local Kuala Lumpur places, select PokmiGo/Comfort/XL, optionally apply `RIDE5`, then book or schedule. Ride Now shows a 2.5-second matching stage followed by a fictional driver. **Advance demo** moves through the remaining trip states. A scheduled ride stays in Activity without immediate matching.
- **Food:** Search or filter eight fictional restaurants with four menu items each. Customize an item, change quantities, apply `FIRSTBITE`, then place a demo order. The cart holds one restaurant; changing restaurants asks before replacing it. Advance the order to delivery and open its receipt.
- **Delivery:** Enter sender/receiver details, choose pickup/drop-off, parcel size and compatible vehicle. `SEND3` follows the fictional fee rule. Advance to a clearly labeled simulated proof of delivery.
- **Shared:** Activity and receipts, local saved addresses, offers, notifications, theme, demo chat, ratings, cancellation, and confirmed demo reset.

All prices are integer sen until display. Route distance uses approximate coordinates, Haversine distance and a fixed road multiplier; it is **not** real routing. Ride fare: RM4.50 + RM1.75/km for PokmiGo, multiplied by 1.45 or 1.8 for Comfort/XL. Delivery fare: Bike RM5 + RM1.20/km or Car RM10 + RM1.70/km, plus RM3 for a medium parcel. Voucher thresholds and food fees are in `src/domain.ts`. These are demonstration prices only.

## Project structure

- `src/domain.ts` — types, status stages, pricing, voucher rules and validation.
- `src/data.ts` — Kuala Lumpur places, restaurants, menus and initial demo profile.
- `src/store.tsx` — shared reducer, local storage and ride matching timer.
- `src/BookingForms.tsx` — Ride and Delivery booking flows.
- `src/Food.tsx` — restaurant discovery, customization and checkout.
- `src/MapExperience.tsx` — offline schematic map plus optional OpenStreetMap tiles.
- `src/Tracking.tsx` — state timeline, demo contacts, completion and receipts.
- `src/App.tsx`, `src/Account.tsx`, `src/components.tsx` — app shell and shared UI.

The schematic map is always available; the optional street map needs external tile access. Neither map uses geocoding, directions, dispatch or tracking APIs. Essential demo state is stored under `uberpokmi-demo-v1` in browser local storage; Account → Reset demo data clears it. Avoid entering actual private contact information into this demo.

## Visual assets

Thirty-two distinct representative food photographs are bundled locally. They depict dishes, not the fictional restaurants' actual food. [Image credits](public/images/credits.html) and the machine-readable [asset registry](public/images/food-assets.json) include origin and licenses. Fictional vehicle renders and driver portrait were generated for this demo; their prompts are in [ASSETS.md](ASSETS.md).

The app was implemented in this local Vite project because Google Gemini Canvas is unavailable in this workspace. It has not been deployed.
