import React, { useState } from "react";
import RoutesTab from "./adapters/ui/RoutesTab";

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
        {tab === "compare" && <div className="p-4">Compare tab (to be implemented in Part 9)</div>}
        {tab === "banking" && <div className="p-4">Banking tab (to be implemented in Part 9)</div>}
        {tab === "pooling" && <div className="p-4">Pooling tab (to be implemented in Part 10)</div>}
      </main>
    </div>
  );
}
