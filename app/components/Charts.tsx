"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Finance = {
  id: number;
  type: "ENTRADA" | "SAIDA";
  category: string;
  value: number;
  date: string;
};

type CategoryData = {
  name: string;
  value: number;
};

type MonthData = {
  month: string;
  entradas: number;
  saídas: number;
};

type Props = {
  finances: Finance[];
};

export default function Charts({ finances }: Props) {
  if (!finances || finances.length === 0) {
    return (
      <div className="text-gray-400 text-center mt-8">
        Nenhum dado disponível para gerar gráficos.
      </div>
    );
  }

  // 🔹 Agrupar por categoria (somente saídas)
  const categoryData: CategoryData[] = Object.values(
    finances
      .filter((f) => f.type === "SAIDA")
      .reduce((acc: Record<string, CategoryData>, f) => {
        if (!acc[f.category]) acc[f.category] = { name: f.category, value: 0 };
        acc[f.category].value += Number(f.value);
        return acc;
      }, {})
  );

  // 🔹 Agrupar por mês (entradas e saídas)
  const monthData: MonthData[] = Object.values(
    finances.reduce((acc: Record<string, MonthData>, f) => {
      const date = new Date(f.date);
      const month = date.toLocaleString("pt-BR", {
        month: "short",
        year: "2-digit",
      });
      if (!acc[month]) acc[month] = { month, entradas: 0, saídas: 0 };

      if (f.type === "ENTRADA") acc[month].entradas += Number(f.value);
      else acc[month].saídas += Number(f.value);

      return acc;
    }, {})
  );

  const COLORS = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
  ];

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 🔸 Gráfico de barras */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-gray-200 text-lg font-medium mb-4">
          Entradas × Saídas (por mês)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar dataKey="entradas" fill="#10B981" />
            <Bar dataKey="saídas" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔸 Gráfico de pizza */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-gray-200 text-lg font-medium mb-4">
          Gastos por categoria
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#10B981"
            >
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
                color: "#fff",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
