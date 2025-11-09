import express from "express";
import routesController from "./routesController";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("FuelEU Maritime API running"));
app.use("/routes", routesController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
