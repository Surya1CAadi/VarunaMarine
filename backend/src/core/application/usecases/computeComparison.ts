import { TARGET_INTENSITY_2025 } from "../../domain/constants";

export type ComputeComparisonOutput = {
  percentDiff: number;
  compliant: boolean;
};

/**
 * computeComparison
 *
 * percentDiff = ((comparison / baseline) - 1) * 100
 *
 * compliant = comparisonIntensity <= target
 *
 * Throws if baselineIntensity is zero to avoid division by zero.
 */
export function computeComparison(
  baselineIntensity: number,
  comparisonIntensity: number,
  target: number = TARGET_INTENSITY_2025,
): ComputeComparisonOutput {
  if (baselineIntensity === 0) {
    throw new Error("baselineIntensity must be non-zero");
  }
  const percentDiff = (comparisonIntensity / baselineIntensity - 1) * 100;
  const compliant = comparisonIntensity <= target;
  return { percentDiff, compliant };
}
