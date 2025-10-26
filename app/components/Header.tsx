"use client";

import { useRouter } from "next/navigation";
import AddFinanceModal from "./AddFinanceModal";
import { LogOut } from "lucide-react"; // ícone moderno
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="p-6 bg-neutral-900 border-b border-neutral-800 flex justify-between items-center relative">
      <h1 className="text-2xl font-semibold text-white tracking-wide">
        💰 Financeiro Familiar
      </h1>

      <div className="flex items-center gap-3">
        <AddFinanceModal onAdded={() => window.location.reload()} />

        <a
          href="/family"
          className="bg-neutral-700 hover:bg-neutral-600 px-3 py-2 rounded-lg text-gray-200 text-sm"
        >
          Família
        </a>

        <button
          onClick={handleLogout}
          disabled={loading}
          title="Sair"
          className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 transition-colors px-3 py-2 rounded-lg text-gray-200 text-sm"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          {loading ? "Saindo..." : "Sair"}
        </button>
      </div>
    </header>
  );
}
