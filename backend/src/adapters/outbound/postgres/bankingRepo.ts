import prisma from "./prismaClient";

/**
 * Banking repository - stores bank entries and computes balances.
 *
 * We model bank entries as positive numbers for banked surplus,
 * and negative numbers for applied amounts.
 */
export const bankingRepo = {
  async createBankEntry(shipId: string, year: number, amount_gco2eq: number) {
    return prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amount_gco2eq,
      },
    });
  },

  async listEntries(shipId: string, year: number) {
    return prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: "asc" },
    });
  },

  async getBalance(shipId: string, year: number) {
    // Sum entries for that ship and year
    const res = await prisma.bankEntry.aggregate({
      _sum: { amount_gco2eq: true },
      where: { shipId, year },
    });
    return res._sum.amount_gco2eq ?? 0;
  },

  /**
   * atomically apply an amount (create negative entry) after checking balance
   */
  async applyAmount(shipId: string, year: number, amount: number) {
    if (amount <= 0) throw new Error("apply amount must be > 0");

    // compute available
    const balance = await this.getBalance(shipId, year);
    if (balance < amount - 1e-9) {
      throw new Error("Insufficient banked amount");
    }

    // create negative entry to represent applied amount
    return prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amount_gco2eq: -Math.abs(amount),
      },
    });
  },
};
