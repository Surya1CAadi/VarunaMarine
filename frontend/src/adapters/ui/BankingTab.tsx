import React, { useEffect, useState } from "react";
import {
  getComplianceCB,
  getAdjustedCB,
  getBankRecords,
  bankAmount,
  applyAmount
} from "../infrastructure/apiClient";

export default function BankingTab() {
  const [shipId, setShipId] = useState("R001");
  const [year, setYear] = useState(2024);
  const [cbData, setCbData] = useState<any>(null);
  const [adjusted, setAdjusted] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);

  async function loadAll() {
    try {
      const cb = await getComplianceCB(shipId, year);
      const adj = await getAdjustedCB(shipId, year);
      const rec = await getBankRecords(shipId, year);
      setCbData(cb);
      setAdjusted(adj);
      setRecords(rec.entries);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error ?? err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, [shipId, year]);

  async function handleBank() {
    if (amount <= 0) return alert("Amount must be > 0");
    await bankAmount(shipId, year, amount);
    await loadAll();
  }

  async function handleApply() {
    if (amount <= 0) return alert("Amount must be > 0");
    await applyAmount(shipId, year, amount);
    await loadAll();
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Banking</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          className="border p-1 rounded"
          placeholder="Ship ID"
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
        />
        <input
          type="number"
          className="border p-1 rounded w-24"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <input
          type="number"
          className="border p-1 rounded w-24"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleBank}>
          Bank
        </button>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleApply}>
          Apply
        </button>
      </div>

      <div className="mb-4">
        {cbData && (
          <p>
            <strong>CB (before):</strong> {cbData.cb_before.toFixed(2)}
          </p>
        )}
        {adjusted && (
          <p>
            <strong>CB (after):</strong> {adjusted.cb_after.toFixed(2)} (bank bal:{" "}
            {adjusted.bank_balance.toFixed(2)})
          </p>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">Bank Entries</h3>
      <table className="min-w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r: any) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.id}</td>
              <td
                className={`p-2 ${
                  r.amount_gco2eq > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {r.amount_gco2eq}
              </td>
              <td className="p-2">
                {new Date(r.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center">
                No records
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
