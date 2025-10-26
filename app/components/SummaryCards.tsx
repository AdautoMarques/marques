"use client";

type Props = {
  totalEntries: number;
  totalExits: number;
};

export default function SummaryCards({ totalEntries, totalExits }: Props) {
  const totalBalance = totalEntries - totalExits;

  const Card = ({
    title,
    value,
    accent,
  }: {
    title: string;
    value: string;
    accent: string;
  }) => (
    <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <Card
        title="Entradas"
        value={`R$ ${totalEntries.toFixed(2)}`}
        accent="text-emerald-400"
      />
      <Card
        title="Saídas"
        value={`R$ ${totalExits.toFixed(2)}`}
        accent="text-rose-400"
      />
      <Card
        title="Saldo Total"
        value={`R$ ${totalBalance.toFixed(2)}`}
        accent={totalBalance >= 0 ? "text-emerald-400" : "text-rose-400"}
      />
    </div>
  );
}
