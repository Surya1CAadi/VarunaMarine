import prisma from "./prismaClient";

/**
 * Compliance repository - stores and retrieves computed CB snapshots.
 */
export const complianceRepo = {
  async createSnapshot(shipId: string, year: number, cb_gco2eq: number) {
    return prisma.shipCompliance.create({
      data: {
        shipId,
        year,
        cb_gco2eq,
      },
    });
  },

  async getLatestSnapshot(shipId: string, year: number) {
    // return latest snapshot for shipId & year
    return prisma.shipCompliance.findFirst({
      where: { shipId, year },
      orderBy: { createdAt: "desc" },
    });
  },

  async listSnapshots(shipId: string, year: number) {
    return prisma.shipCompliance.findMany({
      where: { shipId, year },
      orderBy: { createdAt: "desc" },
    });
  },
};
