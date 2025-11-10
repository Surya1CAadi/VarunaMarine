import React, { useEffect, useState } from "react";
import type { Route } from "../../core/domain/types";
import { fetchRoutes, setBaseline } from "../infrastructure/apiClient";

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ vesselType?: string; fuelType?: string; year?: number }>({});

  async function load() {
    try {
      setLoading(true);
      const rs = await fetchRoutes(filters);
      setRoutes(rs);
    } catch (err) {
      console.error("fetchRoutes error", err);
      alert("Failed to load routes. Check backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters]);

  async function onSetBaseline(routeId: string) {
    try {
      await setBaseline(routeId);
      // refresh
      await load();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error ?? err.message);
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Routes</h2>
        <div className="flex gap-2">
          <select
            onChange={(e) => setFilters((s) => ({ ...s, vesselType: e.target.value || undefined }))}
            className="border rounded p-1"
          >
            <option value="">All vessel types</option>
            <option>Container</option>
            <option>BulkCarrier</option>
            <option>Tanker</option>
            <option>RoRo</option>
          </select>
          <select
            onChange={(e) => setFilters((s) => ({ ...s, fuelType: e.target.value || undefined }))}
            className="border rounded p-1"
          >
            <option value="">All fuel types</option>
            <option>HFO</option>
            <option>LNG</option>
            <option>MGO</option>
          </select>
          <input
            type="number"
            placeholder="year"
            className="border rounded p-1 w-24"
            onChange={(e) => setFilters((s) => ({ ...s, year: e.target.value ? Number(e.target.value) : undefined }))}
          />
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => load()}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">routeId</th>
                <th className="p-2">vesselType</th>
                <th className="p-2">fuelType</th>
                <th className="p-2">year</th>
                <th className="p-2">ghgIntensity</th>
                <th className="p-2">fuelConsumption</th>
                <th className="p-2">distance</th>
                <th className="p-2">totalEmissions</th>
                <th className="p-2">actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.routeId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{r.routeId}</td>
                  <td className="p-2">{r.vesselType}</td>
                  <td className="p-2">{r.fuelType}</td>
                  <td className="p-2">{r.year}</td>
                  <td className="p-2">{r.ghgIntensity}</td>
                  <td className="p-2">{r.fuelConsumption}</td>
                  <td className="p-2">{r.distance}</td>
                  <td className="p-2">{r.totalEmissions}</td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                      onClick={() => onSetBaseline(r.routeId)}
                    >
                      Set Baseline
                    </button>
                    {r.isBaseline && <span className="ml-2 text-green-600">Baseline</span>}
                  </td>
                </tr>
              ))}
              {routes.length === 0 && <tr><td className="p-4" colSpan={9}>No routes</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
