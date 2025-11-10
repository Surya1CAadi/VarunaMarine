import React, { useState } from "react";
import RoutesTab from "./adapters/ui/RoutesTab";
import BankingTab from "./adapters/ui/BankingTab";
import CompareTab from "./adapters/ui/CompareTab";
import PoolingTab from "./adapters/ui/PoolingTab";

export default function App() {
  const [tab, setTab] = useState<"routes" | "compare" | "banking" | "pooling">("routes");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">FuelEU Compliance Dashboard</h1>
          <nav className="flex gap-2">
            <button onClick={() => setTab("routes")} className={`px-3 py-1 rounded ${tab==='routes' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Routes</button>
            <button onClick={() => setTab("compare")} className={`px-3 py-1 rounded ${tab==='compare' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Compare</button>
            <button onClick={() => setTab("banking")} className={`px-3 py-1 rounded ${tab==='banking' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Banking</button>
            <button onClick={() => setTab("pooling")} className={`px-3 py-1 rounded ${tab==='pooling' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Pooling</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {tab === "routes" && <RoutesTab />}
        {tab === "compare" && <CompareTab />}
        {tab === "banking" && <BankingTab />}
        {tab === "pooling" && <PoolingTab />}
      </main>
    </div>
  );
}
