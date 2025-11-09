import { computeComparison } from "../../core/application/usecases/computeComparison";
import { TARGET_INTENSITY_2025 } from "../../core/domain/constants";

describe("computeComparison use-case", () => {
  it("calculates percentDiff and compliant=true for a lower comparison intensity", () => {
    const baseline = 91.0;
    const comparison = 88.0;

    const { percentDiff, compliant } = computeComparison(baseline, comparison, TARGET_INTENSITY_2025);

    // percentDiff = ((88 / 91) - 1) * 100 ≈ -3.2967032967
    expect(percentDiff).toBeCloseTo(-3.2967032967, 6);
    expect(compliant).toBe(true); // 88 <= target 89.3368
  });

  it("calculates percentDiff and compliant=false for a higher comparison intensity", () => {
    const baseline = 91.0;
    const comparison = 93.5;

    const { percentDiff, compliant } = computeComparison(baseline, comparison, TARGET_INTENSITY_2025);

    // percentDiff = ((93.5 / 91) - 1) * 100 ≈ 2.7472527473
    expect(percentDiff).toBeCloseTo(2.7472527473, 6);
    expect(compliant).toBe(false); // 93.5 > target 89.3368
  });

  it("throws when baselineIntensity is zero", () => {
    expect(() => computeComparison(0, 90)).toThrow("baselineIntensity must be non-zero");
  });
});
