"use client";

import { useEffect, useState } from "react";

export default function FamilyPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/family/members");
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
        setCount(data.count);
        setLimit(data.limit);
      } else {
        setError(data.error || "Erro ao carregar membros");
      }
    } catch {
      setError("Falha ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/family/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar membro");

      setForm({ name: "", email: "", password: "" });
      setSuccess("✅ Membro adicionado com sucesso!");
      loadMembers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/family/remove-member", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao remover membro");

      setSuccess("🗑️ Membro removido com sucesso!");
      setConfirmDelete(null);
      loadMembers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 relative">
      <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        {/* 🔙 Botão de Voltar + Título */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-neutral-800 px-3 py-2 rounded-lg transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <span className="text-sm">Voltar</span>
          </button>

          <h1 className="text-2xl font-semibold">👨‍👩‍👧 Família</h1>
        </div>

        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          <>
            <p className="text-gray-400 mb-4">
              Membros:{" "}
              <span className="text-emerald-400 font-medium">
                {count}/{limit}
              </span>
            </p>

            {/* 🔹 Tabela de membros */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-neutral-800 rounded-lg">
                <thead className="bg-neutral-800 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="p-3 text-left">Nome</th>
                    <th className="p-3 text-left">E-mail</th>
                    <th className="p-3 text-center">Desde</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-neutral-800 hover:bg-neutral-800/40"
                    >
                      <td className="p-3">{m.name}</td>
                      <td className="p-3">{m.email}</td>
                      <td className="p-3 text-center">
                        {new Date(m.createdAt).toLocaleDateString("pt-BR", {
                          timeZone: "America/Sao_Paulo",
                        })}
                      </td>
                      <td className="p-3 text-center">
                        {confirmDelete === m.id ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleDelete(m.id)}
                              className="bg-rose-600 hover:bg-rose-500 px-3 py-1 rounded-lg text-xs"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="bg-neutral-700 hover:bg-neutral-600 px-3 py-1 rounded-lg text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(m.id)}
                            className="text-rose-400 hover:text-rose-500 transition"
                            title="Remover membro"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔹 Formulário de adição */}
            {count < limit ? (
              <form onSubmit={handleAdd} className="space-y-4">
                {error && (
                  <p className="text-rose-400 text-sm text-center">{error}</p>
                )}
                {success && (
                  <p className="text-emerald-400 text-sm text-center">
                    {success}
                  </p>
                )}
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-200"
                    required
                  />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-200"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-200"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-white text-sm"
                  >
                    Adicionar membro
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-rose-400 text-center mt-4">
                Limite máximo de 3 membros atingido.
              </p>
            )}
          </>
        )}
      </div>

      {/* 🔹 Toast flutuante */}
      {(success || error) && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-sm ${
            success ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {success || error}
        </div>
      )}
    </div>
  );
}
