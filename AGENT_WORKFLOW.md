# AI Agent Workflow Log

This document explains how GPT-5 (ChatGPT) was used while building the **FuelEU Maritime Compliance Platform** — a full-stack project consisting of:

- **Frontend:** React + TypeScript + TailwindCSS  
- **Backend:** Node.js + TypeScript + PostgreSQL (Prisma)  
- **Architecture:** Hexagonal (core / ports / adapters)

---

## Agents Used
| Agent | Purpose |
|-------|----------|
| **GPT-5 (ChatGPT)** | Used for backend and frontend design, domain modeling, code generation, refactoring, and documentation. |


## Prompts & Outputs

### Example 1 — Compute Compliance Balance (CB)

**Prompt**

Write a TypeScript function computeCB that takes ghgIntensity (gCO2e/MJ) and fuelConsumption_t (tonnes),
uses target intensity 89.3368 gCO2e/MJ and energy per tonne 41000 MJ/t,
and returns { cb, energyScope }. Include validation and a Jest test.

**GPT-5 Output**

export function computeCB({ ghgIntensity, fuelConsumption_t }: { ghgIntensity: number; fuelConsumption_t: number }) {
  const TARGET = 89.3368;
  const MJ_PER_TON = 41000;
  if (fuelConsumption_t <= 0) throw new Error("Invalid fuel consumption");
  const energyScope = fuelConsumption_t * MJ_PER_TON;
  const cb = (TARGET - ghgIntensity) * energyScope;
  return { cb, energyScope };
}

Refinement

Added optional target parameter and clearer variable names.
Verified manually using R001 data.
Added Jest unit tests for both positive and negative CB values.

Example 2 — Pooling Logic (Article 21)

Prompt

Write a TypeScript function createPoolAllocation that accepts ships with cb_before values,
ensures total sum >= 0, and redistributes surpluses to deficits.
Each result must have cb_after and rules: no deficit ship exits worse,
no surplus ship goes negative.

GPT-5 Output

export function createPoolAllocation(members) {
  const total = members.reduce((s, m) => s + m.cb_before, 0);
  if (total < 0) throw new Error("Invalid pool total CB < 0");
  const surpluses = members.filter(m => m.cb_before > 0).sort((a,b)=>b.cb_before - a.cb_before);
  const deficits = members.filter(m => m.cb_before < 0).sort((a,b)=>a.cb_before - b.cb_before);
  // redistribute
  return members.map(m => ({ ...m, cb_after: 0 }));
}

Refinement

Completed redistribution loop.
Added test cases for surplus, mixed, and invalid pools.
Integrated with Prisma to save cb_before and cb_after.

Validation / Corrections

Each GPT-5 output tested using Jest or curl API requests.
Verified CB formula: (Target − Actual) × EnergyInScope.
Adjusted minor type mismatches and Prisma schema relations manually.
Added migrations and seed scripts for persistent data.

Observations

Where GPT-5 saved time
Backend routes and Prisma schema setup.
React components for Routes, Compare, Banking, and Pooling tabs.
Unit test scaffolding for core use-cases.
Where GPT-5 needed corrections
Gave outdated Tailwind versions (^3.5.0 didn’t exist).
Mixed CommonJS and ES module syntax in PostCSS config.
Needed prompt fine-tuning for Prisma relation generation.
Effective workflow
Worked iteratively (one part at a time).
Tested outputs immediately after generation.
Adjusted architecture per GPT-5’s guidance.
Best Practices Followed
Maintained clear hexagonal separation (core, adapters, infrastructure).
Verified every generated snippet with tests.
Avoided single-shot generations — used incremental parts.
Logged all major prompts here for transparency.
Authored final docs manually after verifying all AI-generated outputs.