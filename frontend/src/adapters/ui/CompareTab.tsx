import React, { useEffect, useState } from "react";
import { fetchComparison } from "../infrastructure/apiClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

type CompareRow = {
  routeId: string;
  baseline: number;
  comparison: number;
  percentDiff: number;
  compliant: boolean;
};

export default function CompareTab() {
  const [year, setYear] = useState<number>(2024);
  const [data, setData] = useState<CompareRow[]>([]);
  const [baseline, setBaseline] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetchComparison(year);
      setBaseline(res.baseline);
      setData(res.comparisons);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error ?? "Failed to load comparison");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [year]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Compare Routes</h2>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded p-1 w-24"
        />
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => load()}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <p className="mb-2">
            Baseline: <strong>{baseline}</strong>
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border text-center">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Route</th>
                  <th className="p-2">Baseline</th>
                  <th className="p-2">Comparison</th>
                  <th className="p-2">% Diff</th>
                  <th className="p-2">Compliant</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.routeId} className="border-b">
                    <td className="p-2">{r.routeId}</td>
                    <td className="p-2">{r.baseline.toFixed(2)}</td>
                    <td className="p-2">{r.comparison.toFixed(2)}</td>
                    <td
                      className={`p-2 ${
                        r.percentDiff <= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {r.percentDiff.toFixed(2)} %
                    </td>
                    <td className="p-2">
                      {r.compliant ? "✅" : "❌"}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="routeId" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill="#8884d8" name="Baseline" />
                <Bar dataKey="comparison" fill="#82ca9d" name="Comparison" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
