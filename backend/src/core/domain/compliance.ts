export const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ
export const ENERGY_PER_FUEL_TON = 41000; // MJ/t

export interface ComplianceCalculator {
  calculateComplianceBalance(actualIntensity: number, fuelConsumption: number): number;
  calculateIntensityDifference(baselineIntensity: number, compareIntensity: number): number;
}

export class DefaultComplianceCalculator implements ComplianceCalculator {
  calculateComplianceBalance(actualIntensity: number, fuelConsumption: number): number {
    const energyInScope = fuelConsumption * ENERGY_PER_FUEL_TON;
    return (TARGET_INTENSITY_2025 - actualIntensity) * energyInScope;
  }

  calculateIntensityDifference(baselineIntensity: number, compareIntensity: number): number {
    return ((compareIntensity - baselineIntensity) / baselineIntensity) * 100;
  }
}