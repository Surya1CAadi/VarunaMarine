import prisma from "./prismaClient";

/**
 * A thin repository for routes using Prisma.
 * Keep business logic in core use-cases; repo only reads/writes DB.
 */
export const routesRepo = {
  async getAll(filters: { vesselType?: string; fuelType?: string; year?: number }) {
    const where: any = {};
    if (filters.vesselType) where.vesselType = filters.vesselType;
    if (filters.fuelType) where.fuelType = filters.fuelType;
    if (filters.year) where.year = Number(filters.year);
    return prisma.route.findMany({ where, orderBy: { routeId: "asc" } });
  },

  async setBaseline(routeId: string) {
    const route = await prisma.route.findUnique({ where: { routeId } });
    if (!route) throw new Error(`Route ${routeId} not found`);

    // unset other baselines for the same year
    await prisma.route.updateMany({
      where: { year: route.year },
      data: { isBaseline: false },
    });

    // set this one
    return prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });
  },

  async getBaseline(year: number) {
    return prisma.route.findFirst({ where: { year, isBaseline: true } });
  },

  async getComparison(year: number) {
    return prisma.route.findMany({ where: { year } });
  },
};
