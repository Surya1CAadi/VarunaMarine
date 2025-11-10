// backend/src/adapters/inbound/postgres/poolsController.ts
import express, { Request, Response } from "express";
import { createPoolAllocation, PoolMemberInput } from "../../../core/application/usecases/createPool";
import { poolRepo } from "../../outbound/postgres/poolRepo";

const router = express.Router();

/**
 * POST /pools
 * Body:
 * {
 *   "year": 2024,
 *   "members": [
 *     { "shipId": "R001", "cb_before": -1000 },
 *     { "shipId": "R002", "cb_before": 2000 }
 *   ]
 * }
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { year, members } = req.body as { year: number; members: PoolMemberInput[] };
    if (!year || !Array.isArray(members)) {
      return res.status(400).json({ error: "year and members[] required" });
    }

    // validate members shape
    for (const m of members) {
      if (!m.shipId || typeof m.cb_before !== "number") {
        return res.status(400).json({ error: "each member must have shipId and numeric cb_before" });
      }
    }

    // run allocation
    const allocated = createPoolAllocation(members);

    // persist pool & members
    const { pool, members: createdMembers } = await poolRepo.createPool(year, allocated);

    res.status(201).json({
      poolId: pool.id,
      year: pool.year,
      members: createdMembers.map((c) => ({
        shipId: c.shipId,
        cb_before: c.cb_before,
        cb_after: c.cb_after,
      })),
    });
  } catch (err: any) {
    console.error("POST /pools error:", err);
    if (err.name === "PoolError" || err.message?.includes("Pool")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
