"use client";

import { useState } from "react";

type Props = {
  onAdded: () => void;
};

export default function AddFinanceModal({ onAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "ENTRADA",
    category: "",
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao salvar lançamento.");

      setOpen(false);
      onAdded();
      setForm({
        type: "ENTRADA",
        category: "",
        description: "",
        value: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      alert("Erro ao salvar. Verifique os campos e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-500 transition text-white px-4 py-2 rounded-lg text-sm"
      >
        Adicionar Lançamento
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Novo Lançamento
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Tipo</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-200"
                >
                  <option value="ENTRADA">Entrada</option>
                  <option value="SAIDA">Saída</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Categoria
                </label>
                <input
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-200"
                  placeholder="Ex: Salário, Mercado..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Descrição
                </label>
                <input
                  name="description"
                  type="text"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-200"
                  placeholder="Ex: Pagamento mensal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Valor (R$)
                  </label>
                  <input
                    name="value"
                    type="number"
                    step="0.01"
                    value={form.value}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Data
                  </label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-gray-200 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
