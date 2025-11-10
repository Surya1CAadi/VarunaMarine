// backend/src/adapters/outbound/postgres/poolRepo.ts
import prisma from "./prismaClient";
import type { PoolMemberResult } from "../../../core/application/usecases/createPool";

/**
 * Persist pool and its members
 */

export const poolRepo = {
  async createPool(year: number, members: PoolMemberResult[]) {
    // Transaction: create pool record and pool member rows
    return prisma.$transaction(async (tx) => {
      const pool = await tx.pool.create({
        data: { year },
      });

      const createdMembers = [];
      for (const m of members) {
        const pm = await tx.poolMember.create({
          data: {
            poolId: pool.id,
            shipId: m.shipId,
            cb_before: m.cb_before,
            cb_after: m.cb_after,
          },
        });
        createdMembers.push(pm);
      }

      return { pool, members: createdMembers };
    });
  },

  async getPool(poolId: number) {
    const pool = await prisma.pool.findUnique({ where: { id: poolId } });
    if (!pool) return null;
    const members = await prisma.poolMember.findMany({ where: { poolId } });
    return { pool, members };
  },
};
