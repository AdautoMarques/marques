"use client";

type Finance = {
  id: number;
  type: "ENTRADA" | "SAIDA";
  category: string;
  description?: string;
  value: number | string | null;
  date: string;
};

export default function FinanceTable({ finances }: { finances: Finance[] }) {
  if (!finances || finances.length === 0) {
    return (
      <div className="text-gray-400 text-center mt-6">
        Nenhum lançamento encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-8">
      <table className="w-full text-sm border border-neutral-800 rounded-lg">
        <thead className="bg-neutral-800 text-gray-400 text-xs uppercase">
          <tr>
            <th className="p-3 text-left">Tipo</th>
            <th className="p-3 text-left">Categoria</th>
            <th className="p-3 text-left">Descrição</th>
            <th className="p-3 text-center">Valor</th>
            <th className="p-3 text-center">Data</th>
          </tr>
        </thead>
        <tbody>
          {finances.map((f) => (
            <tr
              key={f.id}
              className="border-b border-neutral-800 hover:bg-neutral-800/40 transition"
            >
              <td
                className={`p-3 font-medium ${
                  f.type === "ENTRADA" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {f.type}
              </td>

              <td className="p-3">{f.category}</td>
              <td className="p-3">{f.description || "-"}</td>

              {/* 🔹 Correção definitiva do erro toFixed */}
              <td
                className={`p-3 text-center ${
                  f.type === "ENTRADA" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                R$ {Number(f.value ?? 0).toFixed(2)}
              </td>

              <td className="p-3 text-center">
                {new Date(f.date).toLocaleDateString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
