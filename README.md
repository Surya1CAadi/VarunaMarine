# FuelEU Maritime — Compliance Module (Frontend + Backend)

Small, structured implementation of the FuelEU Maritime compliance module:
- **Frontend:** React + TypeScript + TailwindCSS (Vite)
- **Backend:** Node.js + TypeScript + PostgreSQL (Prisma)
- **Architecture:** Hexagonal (core / adapters / infra)

This repository is organized into two folders:
- `/frontend` — React app (Vite)
- `/backend` — API (Express + Prisma)

---

## Quick overview

Functionality implemented:
- Routes listing, filters, set baseline.
- Compare baseline vs route intensities + percent diff and compliance flag.
- Compliance CB computation and snapshot persistence.
- Banking: create bank entries, apply banked amounts, view ledger.
- Pooling: greedy allocation, validations, persistence of pools & members.
- Unit tests for core algorithms.

---

## Architecture

FuelEU-Maritime/
├── backend/
│   ├── src/
│   │   ├── core/                       # Domain models & use-cases (pure TS, no frameworks)
│   │   ├── adapters/
│   │   │   ├── inbound/http/           # Express controllers (API endpoints)
│   │   │   └── outbound/postgres/      # Prisma adapters (DB repositories)
│   │   └── infrastructure/             # Server & DB setup
│   ├── prisma/                         # Prisma schema & seed data
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── core/                       # Domain types (shared entities, interfaces)
│   │   ├── adapters/
│   │   │   ├── infrastructure/         # API client (fetch calls to backend)
│   │   │   └── ui/                     # React components (Routes, Compare, Banking, Pooling)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── AGENT_WORKFLOW.md                   # Documentation of GPT-5 usage
├── REFLECTION.md                       # Personal reflection on AI-assisted development
└── README.md                           # Project overview, setup & instructions


**Key design decision:** domain logic lives in `core/` and is framework-agnostic. Adapters translate between HTTP/DB and core use-cases.

---

## Setup & Run (local)

## Prerequisites:

- Node.js (>= 18 recommended)

- npm

- Docker (optional, recommended for local Postgres)


### 1) Start PostgreSQL (recommended using docker-compose)

From repo root:

``
By default the compose file spins up Postgres on localhost:5432 with user postgres / postgres.

2) Backend

cd backend

npm install

# generate prisma client

npx prisma generate


# run DB migrations (creates tables)

npx prisma migrate dev --name init


# seed routes (R001..R005)

npm run prisma:seed


# development server

npm run dev

# server runs at: http://localhost:3000

 **Frontend**

cd frontend

npm install

npm run dev

# app will be available at: http://localhost:5173

## How to run tests

**Backend unit tests (Jest):**

cd backend

npm test

This runs unit tests for computeCB, computeComparison, createPoolAllocation, and bankingRepo tests.

## API Endpoints (examples)

**Routes**

GET /routes — list routes (query params: year, vesselType, fuelType)

POST /routes/:routeId/baseline — set baseline for the route's year

GET /routes/comparison?year=YYYY — baseline vs other routes

**Compliance**

GET /compliance/cb?shipId=R001&year=2024 — compute & store CB snapshot

GET /compliance/adjusted-cb?shipId=R001&year=2024 — latest CB + bank balance applied

 **Banking**

GET /banking/records?shipId=R001&year=2024

POST /banking/bank — body: { shipId, year, amount } (amount > 0)

POST /banking/apply — body: { shipId, year, amount } (apply banked amount)

**Pools**

POST /pools — create pool

body: { year: Number, members: [{ shipId: string, cb_before: number }] }

returns poolId and members with cb_after

## Sample requests (curl)

**Compute CB:**

curl "http://localhost:3000/compliance/cb?shipId=R001&year=2024"
**Bank an amount:**

curl -X POST "http://localhost:3000/banking/bank" -H "Content-Type: application/json" -d "{\"shipId\":\"R001\",\"year\":2024,\"amount\":1000000}"

**Create a pool:**

curl -X POST "http://localhost:3000/pools" -H "Content-Type: application/json" -d "{\"year\":2024,\"members\":[{\"shipId\":\"R002\",\"cb_before\":50000},{\"shipId\":\"R001\",\"cb_before\":-50000}]}"

## Where to look in the code

**Core formulas & use-cases**: backend/src/core/application/usecases/

**Prisma schema & seed**: backend/prisma/

**Controllers**: backend/src/adapters/inbound/http/

**Repositories** (Prisma adapters): backend/src/adapters/outbound/postgres/

**Frontend** pages/components: frontend/src/adapters/ui/

## Notes & Caveats

This project is intentionally minimal and focused on demonstrating architecture and correctness of computations.

Edge-case handling and production hardening (auth, rate limits, input sanitization, CI, backups) should be added for a real deployment.

AI agents were used for scaffolding and suggestions — all outputs were reviewed and tested manually.