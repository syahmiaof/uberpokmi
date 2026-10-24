<div align="center">
  <h1>UberPokmi</h1>
  <p><strong>Ride, Food and Delivery in one interactive Malaysian superapp demo.</strong></p>
  <p><a href="https://uberpokmi.syahmiaof.my/">Open demo</a> · <a href="https://syahmiaof.my/projects">Portfolio</a></p>
</div>

![UberPokmi social preview](public/og-uberpokmi.png)

UberPokmi is a frontend-only simulation set around Kuala Lumpur. Try a fictional ride, food order or parcel delivery, advance its status and inspect the result in Activity. It uses local demo state, not a live transport or commerce service.

## What is implemented

- **Ride:** choose places and vehicle class, apply a demo offer, book now or schedule, then advance a fictional trip.
- **Food:** browse fictional restaurants, customize items, manage a single-restaurant cart and complete a demo checkout.
- **Delivery:** enter sender, recipient and parcel details, choose a vehicle and advance to simulated proof of delivery.
- **Shared:** Activity, receipts, saved addresses, offers, notifications, theme, demo chat, ratings and reset.
- Responsive desktop/mobile UI and an offline schematic map with optional OpenStreetMap tiles.

Prices are calculated in integer sen. Distance is estimated from coordinates with a fixed multiplier; it is not live routing.

## Run

Node.js 20.19+ or 22.12+ is required.

```bash
npm ci
npm run dev
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

`npm run smoke:prod` checks the configured production URL. It needs browser/network access and should be run separately from local tests.

## Structure

- `src/domain.ts` — types, pricing and validation.
- `src/data.ts` — fictional places, restaurants and menus.
- `src/store.tsx` — shared local state and status transitions.
- `src/BookingForms.tsx`, `src/Food.tsx`, `src/Tracking.tsx` — service flows.
- `src/MapExperience.tsx` — schematic and optional street map.
- `tests/` and `scripts/` — browser checks and production smoke script.

## Assets and limits

Food photographs represent dishes, not actual fictional restaurants. See [image credits](public/images/credits.html), [asset registry](public/images/food-assets.json) and [ASSETS.md](ASSETS.md). The app has no real payment, dispatch, GPS, login, messaging or delivery network. Browser local storage holds demo state under `uberpokmi-demo-v1`; avoid entering real private contact details.

The main branch is configured for Vercel deployment at [uberpokmi.syahmiaof.my](https://uberpokmi.syahmiaof.my/).

## Builder

[Muhammad Syahmi](https://syahmiaof.my)
