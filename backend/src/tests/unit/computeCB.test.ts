import { computeCB } from "../../core/application/usecases/computeCB";

/**
 * Test vector based on seed data (R001)
 *
 * R001:
 *   ghgIntensity = 91.0 gCO2e/MJ
 *   fuelConsumption = 5000 t
 *
 * energyScope = 5000 * 41000 = 205000000 MJ
 * target = 89.3368
 *
 * cb = (89.3368 - 91.0) * 205000000 = -340,956,000 (approximately)
 */

describe("computeCB use-case", () => {
  it("computes CB and energyScope for R001 example", () => {
    const { cb, energyScope } = computeCB({
      ghgIntensity: 91.0,
      fuelConsumption_t: 5000,
    });

    // energyScope exact
    expect(energyScope).toBe(205000000);

    // cb should be approximately -340,956,000 (allow small floating point tolerance)
    expect(cb).toBeCloseTo(-340956000, 0); // 0 decimal places tolerance
  });

  it("returns positive CB when ghgIntensity < target", () => {
    const result = computeCB({ ghgIntensity: 80.0, fuelConsumption_t: 100 });
    expect(result.cb).toBeGreaterThan(0);
  });

  it("throws for negative fuel consumption", () => {
    expect(() => {
      // intentionally bypass TypeScript check to test runtime validation
      // @ts-ignore
      return computeCB({ ghgIntensity: 90, fuelConsumption_t: -1 });
    }).toThrow();
  });
});
