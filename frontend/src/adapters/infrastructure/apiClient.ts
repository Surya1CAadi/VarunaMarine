import axios from "axios";
import type { Route } from "../../core/domain/types";

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

const api = axios.create({
  baseURL: BASE,
  timeout: 7000,
});

export async function fetchRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
  const res = await api.get("/routes", { params: filters });
  return res.data;
}

export async function setBaseline(routeId: string) {
  const res = await api.post(`/routes/${routeId}/baseline`);
  return res.data;
}


export async function fetchComparison(year: number) {
  const res = await api.get("/routes/comparison", { params: { year } });
  return res.data;
}

export async function getComplianceCB(shipId: string, year: number) {
  const res = await api.get("/compliance/cb", { params: { shipId, year } });
  return res.data;
}

export async function getAdjustedCB(shipId: string, year: number) {
  const res = await api.get("/compliance/adjusted-cb", { params: { shipId, year } });
  return res.data;
}

export async function bankAmount(shipId: string, year: number, amount: number) {
  const res = await api.post("/banking/bank", { shipId, year, amount });
  return res.data;
}

export async function applyAmount(shipId: string, year: number, amount: number) {
  const res = await api.post("/banking/apply", { shipId, year, amount });
  return res.data;
}

export async function getBankRecords(shipId: string, year: number) {
  const res = await api.get("/banking/records", { params: { shipId, year } });
  return res.data;
}


export default api;
