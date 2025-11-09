import express, { Request, Response } from "express";
import { bankingRepo } from "../../outbound/postgres/bankingRepo";

const router = express.Router();

/**
 * GET /banking/records?shipId=R001&year=2024
 */
router.get("/records", async (req: Request, res: Response) => {
  try {
    const shipId = String(req.query.shipId || "");
    const year = Number(req.query.year);
    if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

    const entries = await bankingRepo.listEntries(shipId, year);
    const balance = await bankingRepo.getBalance(shipId, year);

    res.json({ shipId, year, balance, entries });
  } catch (err: any) {
    console.error("GET /banking/records error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /banking/bank
 * body: { shipId, year, amount }
 *
 * Bank positive CB (amount > 0)
 */
router.post("/bank", async (req: Request, res: Response) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || typeof amount !== "number") {
      return res.status(400).json({ error: "shipId, year and numeric amount required" });
    }
    if (amount <= 0) return res.status(400).json({ error: "amount must be > 0" });

    const entry = await bankingRepo.createBankEntry(shipId, year, amount);
    const balance = await bankingRepo.getBalance(shipId, year);
    res.json({ message: "banked", entry, balance });
  } catch (err: any) {
    console.error("POST /banking/bank error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /banking/apply
 * body: { shipId, year, amount }
 *
 * Apply banked surplus to a deficit (creates a negative entry).
 * Validates amount <= available.
 */
router.post("/apply", async (req: Request, res: Response) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || typeof amount !== "number") {
      return res.status(400).json({ error: "shipId, year and numeric amount required" });
    }
    if (amount <= 0) return res.status(400).json({ error: "amount must be > 0" });

    const applied = await bankingRepo.applyAmount(shipId, year, amount);
    const balance = await bankingRepo.getBalance(shipId, year);
    res.json({ message: "applied", applied, balance });
  } catch (err: any) {
    console.error("POST /banking/apply error:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;

