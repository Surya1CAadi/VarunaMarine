import express, { Request, Response } from "express";
import { routesRepo } from "../../outbound/postgres/routesRepo";
import { computeComparison } from "../../../core/application/usecases/computeComparison";

const router = express.Router();

/**
 * GET /routes?year=&vesselType=&fuelType=
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const routes = await routesRepo.getAll({
      vesselType: req.query.vesselType as string | undefined,
      fuelType: req.query.fuelType as string | undefined,
      year: req.query.year ? Number(req.query.year) : undefined,
    });
    res.json(routes);
  } catch (err: any) {
    console.error("GET /routes error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /routes/:routeId/baseline
 */
router.post("/:routeId/baseline", async (req: Request, res: Response) => {
  try {
    const updated = await routesRepo.setBaseline(req.params.routeId);
    res.json({ message: "Baseline set", route: updated });
  } catch (err: any) {
    console.error("POST /routes/:routeId/baseline error:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /routes/comparison?year=2024
 */
router.get("/comparison", async (req: Request, res: Response) => {
  try {
    const year = Number(req.query.year);
    if (!year) return res.status(400).json({ error: "year query required" });

    const baseline = await routesRepo.getBaseline(year);
    if (!baseline) return res.status(404).json({ error: "No baseline for that year" });

    const routes = await routesRepo.getComparison(year);
    const result = routes
      .filter((r) => r.routeId !== baseline.routeId)
      .map((r) => {
        const { percentDiff, compliant } = computeComparison(
          baseline.ghgIntensity,
          r.ghgIntensity,
        );
        return {
          routeId: r.routeId,
          baseline: baseline.ghgIntensity,
          comparison: r.ghgIntensity,
          percentDiff,
          compliant,
        };
      });

    res.json({ baseline: baseline.routeId, baselineIntensity: baseline.ghgIntensity, comparisons: result });
  } catch (err: any) {
    console.error("GET /routes/comparison error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
