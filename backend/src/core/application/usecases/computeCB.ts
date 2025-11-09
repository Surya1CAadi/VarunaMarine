import { TARGET_INTENSITY_2025, MJ_PER_TON_FUEL } from "../../domain/constants";

export type ComputeCBInput = {
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumption_t: number; // t
  target?: number;
};

export type ComputeCBOutput = {
  cb: number; // gCO2e (can be negative for deficit)
  energyScope: number; // MJ
};

/**
 * computeCB - computes the Compliance Balance (CB)
 *
 * Formula:
 *   energyScope (MJ) = fuelConsumption_t * MJ_PER_TON_FUEL
 *   CB (gCO2e) = (target - actual) * energyScope
 *
 * Positive CB => surplus; Negative CB => deficit
 */
export function computeCB(input: ComputeCBInput): ComputeCBOutput {
  const { ghgIntensity, fuelConsumption_t, target = TARGET_INTENSITY_2025 } = input;

  if (fuelConsumption_t < 0) {
    throw new Error("fuelConsumption_t must be >= 0");
  }

  const energyScope = fuelConsumption_t * MJ_PER_TON_FUEL;
  const cb = (target - ghgIntensity) * energyScope;
  return {
    cb,
    energyScope,
  };
}
