import express, { Request, Response } from "express";
import { computeCB } from "../../../core/application/usecases/computeCB";
import prisma from "../../outbound/postgres/prismaClient";
import { complianceRepo } from "../../outbound/postgres/complianceRepo";
import { bankingRepo } from "../../outbound/postgres/bankingRepo";
import { routesRepo } from "../../outbound/postgres/routesRepo";

const router = express.Router();

/**
 * GET /compliance/cb?shipId=R001&year=2024
 *
 * Computes CB for the given ship (routeId) and year, persists a snapshot, and returns result.
 */
router.get("/cb", async (req: Request, res: Response) => {
  try {
    const shipId = String(req.query.shipId || "");
    const year = Number(req.query.year);

    if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

    // find route by routeId == shipId and year
    const route = await prisma.route.findUnique({ where: { routeId: shipId } });
    if (!route || route.year !== year) {
      return res.status(404).json({ error: "route not found for shipId/year" });
    }

    const { cb, energyScope } = computeCB({
      ghgIntensity: route.ghgIntensity,
      fuelConsumption_t: route.fuelConsumption,
    });

    // persist snapshot
    const snapshot = await complianceRepo.createSnapshot(shipId, year, cb);

    res.json({
      shipId,
      year,
      cb_before: cb,
      energyScope,
      snapshotId: snapshot.id,
    });
  } catch (err: any) {
    console.error("GET /compliance/cb error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /compliance/adjusted-cb?shipId=R001&year=2024
 *
 * Returns CB after bank entries (banked surplus increases CB).
 */
router.get("/adjusted-cb", async (req: Request, res: Response) => {
  try {
    const shipId = String(req.query.shipId || "");
    const year = Number(req.query.year);
    if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

    // get latest computed CB snapshot
    const latest = await complianceRepo.getLatestSnapshot(shipId, year);
    if (!latest) return res.status(404).json({ error: "No CB snapshot for this ship/year" });

    const bankBalance = await bankingRepo.getBalance(shipId, year);
    // adjusted = cb + bankBalance
    const adjusted = latest.cb_gco2eq + bankBalance;

    res.json({
      shipId,
      year,
      cb_before: latest.cb_gco2eq,
      bank_balance: bankBalance,
      cb_after: adjusted,
    });
  } catch (err: any) {
    console.error("GET /compliance/adjusted-cb error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
