"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import Charts from "../components/Charts";
import FinanceTable from "../components/FinanceTable";

export default function DashboardPage() {
  const [finances, setFinances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔹 Buscar finanças (envia datas cruas YYYY-MM-DD)
  const fetchFinances = async (start?: string, end?: string) => {
    try {
      let url = "/api/finances";
      if (start && end) url += `?start=${start}&end=${end}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setFinances(data);
      else setFinances([]);
    } catch (error) {
      console.error("Erro ao carregar finanças:", error);
      setFinances([]);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchFinances();
      setLoading(false);
    })();
  }, []);

  const handleFilter = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    await fetchFinances(startDate, endDate);
    setLoading(false);
  };

  const clearFilter = async () => {
    setStartDate("");
    setEndDate("");
    setLoading(true);
    await fetchFinances();
    setLoading(false);
  };

  if (loading) return <p className="text-gray-400 p-6">Carregando...</p>;

  const sum = (arr: any[], type: "ENTRADA" | "SAIDA") =>
    arr.filter((f) => f.type === type).reduce((s, f) => s + Number(f.value), 0);

  const totalEntries = sum(finances, "ENTRADA");
  const totalExits = sum(finances, "SAIDA");

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="max-w-6xl mx-auto p-6">
        {/* 🔹 Filtro por período */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">De:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Até:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <button
            onClick={handleFilter}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm text-white"
          >
            Filtrar
          </button>

          <button
            onClick={clearFilter}
            className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg text-sm text-gray-200"
          >
            Limpar
          </button>
        </div>

        {/* 🔹 Cards de resumo */}
        <SummaryCards totalEntries={totalEntries} totalExits={totalExits} />

        {/* 🔹 Gráficos */}
        <Charts finances={finances} />

        {/* 🔹 Tabela */}
        <FinanceTable finances={finances} />
      </main>
    </div>
  );
}
