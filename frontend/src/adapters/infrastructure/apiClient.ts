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

export default api;
