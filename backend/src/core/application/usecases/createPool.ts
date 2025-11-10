// backend/src/core/application/usecases/createPool.ts

export type PoolMemberInput = {
  shipId: string;
  cb_before: number; // gCO2e (can be negative)
};

export type PoolMemberResult = {
  shipId: string;
  cb_before: number;
  cb_after: number;
};

export class PoolError extends Error {}

export function createPoolAllocation(members: PoolMemberInput[]): PoolMemberResult[] {
  if (!Array.isArray(members) || members.length === 0) {
    throw new PoolError("members required");
  }

  // clone inputs to avoid mutation of caller objects
  const cloned = members.map((m) => ({ ...m }));

  const sumBefore = cloned.reduce((s, m) => s + m.cb_before, 0);
  if (sumBefore < -1e-9) {
    throw new PoolError("Pool total CB must be non-negative");
  }

  // partition surpluses and deficits
  const surpluses = cloned.filter((m) => m.cb_before > 0).map((m) => ({ ...m }));
  const deficits = cloned.filter((m) => m.cb_before < 0).map((m) => ({ ...m }));

  // Sort surpluses descending by cb_before (largest first)
  surpluses.sort((a, b) => b.cb_before - a.cb_before);

  // Sort deficits ascending by cb_before (most negative first)
  deficits.sort((a, b) => a.cb_before - b.cb_before);

  // For each deficit, greedily consume surplus
  for (const deficit of deficits) {
    let need = -deficit.cb_before; // positive amount needed
    for (const surplus of surpluses) {
      if (need <= 1e-9) break;
      if (surplus.cb_before <= 1e-9) continue;

      const transfer = Math.min(surplus.cb_before, need);
      surplus.cb_before = +(surplus.cb_before - transfer); // update surplus
      need = +(need - transfer);
      deficit.cb_before = +(deficit.cb_before + transfer); // increased toward zero
    }

    // After attempting allocation, if still need -> impossible
    if (need > 1e-6) {
      throw new PoolError("Insufficient surplus to cover deficits (shouldn't happen given prior check)");
    }
  }

  // Final cb_after are the updated cb_before values of original members
  // Build map from shipId to cb_after
  const map = new Map<string, number>();
  for (const s of surpluses) map.set(s.shipId, s.cb_before);
  for (const d of deficits) map.set(d.shipId, d.cb_before);
  // zero-members (neither surplus nor deficit)
  for (const m of cloned.filter((m) => Math.abs(m.cb_before) <= 1e-9)) map.set(m.shipId, 0);

  // Create results preserving input order
  const results: PoolMemberResult[] = members.map((m) => ({
    shipId: m.shipId,
    cb_before: m.cb_before,
    cb_after: map.get(m.shipId) ?? m.cb_before,
  }));

  // Validate rules post-allocation:
  // - deficit ship cannot exit worse (cb_after >= cb_before)
  // - surplus ship cannot exit negative (cb_after >= 0)
  for (const r of results) {
    if (r.cb_before < 0 && r.cb_after < r.cb_before - 1e-9) {
      throw new PoolError(`Deficit ship ${r.shipId} would exit worse`);
    }
    if (r.cb_before > 0 && r.cb_after < -1e-9) {
      throw new PoolError(`Surplus ship ${r.shipId} would become negative`);
    }
  }

  return results;
}
