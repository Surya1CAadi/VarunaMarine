import { ComplianceCalculator } from '../domain/compliance';
import { RouteRepository, ComplianceRepository } from '../ports/repositories';
import { Route, ShipCompliance } from '../domain/entities';

export class RouteService {
  constructor(
    private routeRepository: RouteRepository,
    private calculator: ComplianceCalculator
  ) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }

  async setBaseline(id: string): Promise<Route> {
    return this.routeRepository.setBaseline(id);
  }

  async getRouteComparison(): Promise<Array<{ 
    route: Route, 
    percentDiff: number, 
    compliant: boolean 
  }>> {
    const baseline = await this.routeRepository.getBaseline();
    if (!baseline) {
      throw new Error('No baseline route set');
    }

    const routes = await this.routeRepository.findAll();
    return routes
      .filter(route => route.id !== baseline.id)
      .map(route => {
        const percentDiff = this.calculator.calculateIntensityDifference(
          baseline.ghgIntensity,
          route.ghgIntensity
        );
        return {
          route,
          percentDiff,
          compliant: route.ghgIntensity <= baseline.ghgIntensity
        };
      });
  }
}

export class ComplianceService {
  constructor(
    private complianceRepository: ComplianceRepository,
    private calculator: ComplianceCalculator
  ) {}

  async computeAndSaveCompliance(
    shipId: string,
    year: number,
    actualIntensity: number,
    fuelConsumption: number
  ): Promise<ShipCompliance> {
    const cb = this.calculator.calculateComplianceBalance(actualIntensity, fuelConsumption);
    
    const compliance: ShipCompliance = {
      id: `${shipId}-${year}`,
      shipId,
      year,
      cbGco2eq: cb
    };

    return this.complianceRepository.saveCompliance(compliance);
  }
}