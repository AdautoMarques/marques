"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion"; // 💫 animações

type Finance = {
  id: number;
  type: "ENTRADA" | "SAIDA";
  category: string;
  value: number | string;
  date: string;
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
  const categoryData = Object.values(
    finances
      .filter((f) => f.type === "SAIDA")
      .reduce((acc: any, f) => {
        if (!acc[f.category]) acc[f.category] = { name: f.category, value: 0 };
        acc[f.category].value += Number(f.value ?? 0);
        return acc;
      }, {})
  );

  // 🔹 Agrupar por mês (entradas e saídas)
  const monthData = Object.values(
    finances.reduce((acc: any, f) => {
      const date = new Date(f.date);
      const month = date.toLocaleString("pt-BR", {
        month: "short",
        year: "2-digit",
      });
      if (!acc[month]) acc[month] = { month, entradas: 0, saídas: 0 };

      if (f.type === "ENTRADA") acc[month].entradas += Number(f.value ?? 0);
      else acc[month].saídas += Number(f.value ?? 0);

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
    "#F472B6",
    "#A855F7",
    "#FACC15",
  ];

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 🔸 Gráfico de barras com animação */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
      >
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
            <Bar dataKey="entradas" fill="#10B981" animationDuration={800} />
            <Bar dataKey="saídas" fill="#EF4444" animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 🔸 Gráfico de pizza com animação e legenda centralizada */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center"
      >
        <h2 className="text-gray-200 text-lg font-medium mb-4">
          Gastos por categoria
        </h2>

        <div className="w-full flex flex-col items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                labelLine={false}
                isAnimationActive={true}
                animationDuration={1200}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `R$ ${Number(value).toFixed(2).replace(".", ",")}`
                }
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legenda personalizada */}
          <div className="flex flex-wrap justify-center mt-4 gap-3 text-gray-300 text-sm">
            {categoryData.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="truncate max-w-[120px]">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
