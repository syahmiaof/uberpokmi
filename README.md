<div align="center">
  <h1>uberpokmi</h1>
  <p><strong>Interactive Malaysian Mobility & Delivery Superapp Simulation</strong></p>
  <p>
    <a href="https://uberpokmi.syahmiaof.my"><img src="https://img.shields.io/badge/Demo-Live-60E1B5?style=for-the-badge&logoColor=60E1B5&labelColor=101713" alt="Demo"></a>
    <a href="https://github.com/syahmiaof/uberpokmi"><img src="https://img.shields.io/badge/Source-GitHub-60E1B5?style=for-the-badge&logo=github&logoColor=60E1B5&labelColor=101713" alt="GitHub"></a>
    <a href="https://github.com/syahmiaof/uberpokmi/actions"><img src="https://img.shields.io/badge/CI-Passing-60E1B5?style=for-the-badge&logo=githubactions&logoColor=60E1B5&labelColor=101713" alt="CI"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-All_Rights_Reserved-60E1B5?style=for-the-badge&logoColor=60E1B5&labelColor=101713" alt="License"></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/React-19.2-101713?style=for-the-badge&logo=react&logoColor=60E1B5" alt="React">
    <img src="https://img.shields.io/badge/Vite-7.2-101713?style=for-the-badge&logo=vite&logoColor=60E1B5" alt="Vite">
    <img src="https://img.shields.io/badge/TypeScript-5.9-101713?style=for-the-badge&logo=typescript&logoColor=60E1B5" alt="TypeScript">
    <img src="https://img.shields.io/badge/Leaflet-1.9-101713?style=for-the-badge&logo=leaflet&logoColor=60E1B5" alt="Leaflet">
    <img src="https://img.shields.io/badge/Vitest-5.0-101713?style=for-the-badge&logo=vitest&logoColor=60E1B5" alt="Vitest">
  </p>
</div>

---

<div align="center">
  <img src="public/og-uberpokmi.png" alt="UberPokmi Superapp Social Preview" width="100%">
</div>

---

## 🚗 Overview & System Simulation

**UberPokmi** (`uberpokmi.syahmiaof.my`) is a comprehensive frontend simulation of a Malaysian multi-service on-demand superapp (Ride, Food delivery, and Parcel courier), localized around the Klang Valley and Kuala Lumpur metropolitan region. Engineered with modern React 19 and Vite 7, it demonstrates complex interactive client state management, deterministic dynamic pricing in integer sen, and reactive geospatial rendering.

### Key Value Pillars:
- **Functionality**: Unified three-tier service workflow featuring Ride hailing (vehicle tiering, dynamic fare calculation, multi-stage ride progression), Food ordering (restaurant menus, customized modifier carts, single-vendor checkout), and Courier delivery (sender/recipient coordinates, vehicle parcel matching, proof-of-delivery tracking).
- **Aesthetic Excellence**: High-density mobile-first design with dark mode ergonomics, fluid layout transitions, interactive Leaflet street maps, and tactile tactile micro-feedback.
- **Business Impact**: Serves as an advanced architecture showcase demonstrating how high-complexity mobile application state machines and offline-first workflows can run smoothly in pure client-side web runtimes.

---

## 🏗️ Architecture & Core Components

- `src/domain.ts` — Type-safe domain schemas, integer sen pricing math, and geospatial coordinate validations.
- `src/data.ts` — Structured Malaysian locations, simulated culinary vendors, and detailed regional menus.
- `src/store.tsx` — Central reactive state container handling lifecycle states for trips, orders, and courier dispatch.
- `src/MapExperience.tsx` — Adaptive dual-mode mapping engine supporting schematic vectors and OpenStreetMap tiles.
- `src/BookingForms.tsx` & `src/Tracking.tsx` — Service configuration flows and real-time order lifecycle tracking views.

---

## 🚀 Live Production & Infrastructure

- **Live Production URL**: [https://uberpokmi.syahmiaof.my](https://uberpokmi.syahmiaof.my)
- **Deployment Platform**: Vercel Global Edge Network on `main` branch
- **Continuous Validation**: Automated GitHub Actions CI workflow executing strict TypeScript type checks, ESLint analysis, and Vitest test suites.

---

## 📄 License & Intellectual Property

Proprietary Software. Copyright &copy; 2026 Muhammad Syahmi (`syahmiaof`). All rights reserved.  
Created solely for demonstration and portfolio showcase purposes. See [LICENSE](LICENSE) for details.
