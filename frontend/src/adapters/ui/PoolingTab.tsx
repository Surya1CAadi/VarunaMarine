import React, { useState } from "react";
import { createPool } from "../infrastructure/apiClient";

type MemberRow = {
  id: string;
  shipId: string;
  cb_before: number | "";
};

type PoolResultMember = {
  shipId: string;
  cb_before: number;
  cb_after: number;
};

export default function PoolingTab() {
  const [year, setYear] = useState<number>(2024);
  const [members, setMembers] = useState<MemberRow[]>([
    { id: cryptoRandomId(), shipId: "R001", cb_before: "" },
  ]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ poolId: number; year: number; members: PoolResultMember[] } | null>(null);

  // compute sum
  const numericMembers = members.map((m) => ({ ...m, cb_before: typeof m.cb_before === "number" ? m.cb_before : 0 }));
  const poolSum = numericMembers.reduce((s, m) => s + (m.cb_before as number), 0);

  const isValidMembers = members.length > 0 && members.every((m) => m.shipId.trim().length > 0 && typeof m.cb_before === "number" && !Number.isNaN(m.cb_before));

  const createDisabled = !isValidMembers || poolSum < -1e-6 || creating;

  function updateMember(id: string, fields: Partial<MemberRow>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...fields } : m)));
  }

  function addMember() {
    setMembers((p) => [...p, { id: cryptoRandomId(), shipId: "", cb_before: "" }]);
  }

  function removeMember(id: string) {
    setMembers((p) => p.filter((m) => m.id !== id));
  }

  async function handleCreatePool() {
    setError(null);
    setResult(null);
    if (createDisabled) {
      setError("Invalid pool. Make sure all members have shipId and numeric cb_before, and pool sum >= 0.");
      return;
    }
    try {
      setCreating(true);
      // prepare payload: convert cb_before to numbers
      const payloadMembers = members.map((m) => ({ shipId: m.shipId.trim(), cb_before: Number(m.cb_before) }));
      const res = await createPool(year, payloadMembers);
      setResult(res);
      // Optionally reset members or keep them
    } catch (err: any) {
      console.error("createPool error", err);
      setError(err?.response?.data?.error ?? err.message ?? "Failed to create pool");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pooling</h2>

      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2">
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border p-1 rounded w-28"
          />
        </label>

        <div className="px-3 py-2 rounded">
          Pool Sum:
          <span className={`ml-2 font-semibold ${poolSum >= -1e-6 ? "text-green-600" : "text-red-600"}`}>
            {poolSum.toFixed(2)}
          </span>
        </div>

        <button className="ml-auto px-3 py-1 bg-gray-200 rounded" onClick={addMember}>Add Member</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2 w-48">Ship ID</th>
              <th className="p-2 w-48">CB (before)</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="p-2">
                  <input
                    value={m.shipId}
                    onChange={(e) => updateMember(m.id, { shipId: e.target.value })}
                    className="border p-1 rounded w-full"
                    placeholder="e.g., R001"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={m.cb_before === "" ? "" : String(m.cb_before)}
                    onChange={(e) => {
                      const v = e.target.value;
                      const num = v === "" ? "" : Number(v);
                      updateMember(m.id, { cb_before: num });
                    }}
                    className="border p-1 rounded w-full"
                    placeholder="e.g., -50000 or 100000"
                  />
                </td>
                <td className="p-2">
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => removeMember(m.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      <div className="mt-4 flex gap-2">
        <button className={`px-4 py-2 rounded ${createDisabled ? "bg-gray-300 text-gray-600" : "bg-blue-600 text-white"}`} disabled={createDisabled} onClick={handleCreatePool}>
          {creating ? "Creating..." : "Create Pool"}
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Pool Created — ID: {result.poolId}</h3>
          <table className="min-w-full border">
            <thead><tr className="border-b"><th className="p-2">Ship</th><th className="p-2">CB Before</th><th className="p-2">CB After</th></tr></thead>
            <tbody>
              {result.members.map((m) => (
                <tr key={m.shipId} className="border-b">
                  <td className="p-2">{m.shipId}</td>
                  <td className="p-2">{m.cb_before.toFixed(2)}</td>
                  <td className="p-2">{m.cb_after.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** small helper to generate ids in browsers without crypto.randomUUID fallback */
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  return Math.random().toString(36).slice(2, 9);
}
