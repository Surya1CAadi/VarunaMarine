export interface Route {
  id: string;
  routeId: string;
  year: number;
  ghgIntensity: number;
  isBaseline: boolean;
}

export interface ShipCompliance {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number;
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
}

export interface Pool {
  id: string;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}