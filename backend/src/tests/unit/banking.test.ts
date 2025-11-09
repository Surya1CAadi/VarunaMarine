import { bankingRepo } from "../../adapters/outbound/postgres/bankingRepo";
import prisma from "../../adapters/outbound/postgres/prismaClient";

describe("bankingRepo apply", () => {
  const shipId = "TEST_SHIP";
  const year = 2099;

  beforeAll(async () => {
    // ensure clean state: remove any existing entries for ship/year
    await prisma.bankEntry.deleteMany({ where: { shipId, year } });
  });

  afterAll(async () => {
    await prisma.bankEntry.deleteMany({ where: { shipId, year } });
    await prisma.$disconnect();
  });

  it("should allow banking positive amount and apply it", async () => {
    const e1 = await bankingRepo.createBankEntry(shipId, year, 1000);
    expect(e1.amount_gco2eq).toBe(1000);

    const balance1 = await bankingRepo.getBalance(shipId, year);
    expect(balance1).toBe(1000);

    const applied = await bankingRepo.applyAmount(shipId, year, 400);
    expect(applied.amount_gco2eq).toBe(-400);

    const balance2 = await bankingRepo.getBalance(shipId, year);
    expect(balance2).toBe(600);
  });

  it("should prevent over-applying", async () => {
    const balance = await bankingRepo.getBalance(shipId, year);
    await expect(bankingRepo.applyAmount(shipId, year, balance + 1)).rejects.toThrow();
  });
});
