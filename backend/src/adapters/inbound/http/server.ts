import express from "express";
import routesController from "./routesController";
import complianceController from "./complianceController";
import bankingController from "./bankingController";
import cors from "cors";
import poolsController from "./poolsController";


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("FuelEU Maritime API running"));
app.use("/routes", routesController);
app.use("/compliance", complianceController);
app.use("/banking", bankingController);
app.use("/pools", poolsController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
