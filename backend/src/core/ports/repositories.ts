import { Route, ShipCompliance, BankEntry, Pool, PoolMember } from '../domain/entities';

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  setBaseline(id: string): Promise<Route>;
  getBaseline(): Promise<Route | null>;
}

export interface ComplianceRepository {
  saveCompliance(compliance: ShipCompliance): Promise<ShipCompliance>;
  findCompliance(shipId: string, year: number): Promise<ShipCompliance | null>;
}

export interface BankingRepository {
  saveBankEntry(entry: BankEntry): Promise<BankEntry>;
  findBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBankedAmount(shipId: string): Promise<number>;
}

export interface PoolRepository {
  createPool(pool: Pool): Promise<Pool>;
  addPoolMember(member: PoolMember): Promise<PoolMember>;
  findPool(id: string): Promise<Pool | null>;
  findPoolMembers(poolId: string): Promise<PoolMember[]>;
}