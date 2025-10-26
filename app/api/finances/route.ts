import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const start = url.searchParams.get("start"); // esperado: "YYYY-MM-DD"
  const end = url.searchParams.get("end"); // esperado: "YYYY-MM-DD"

  // ✅ Autenticação (mantenha como já estava no seu projeto)
  const token = req.headers
    .get("cookie")
    ?.split("auth_token=")[1]
    ?.split(";")[0];
  const decoded = verifyToken(token || "") as {
    id?: number;
    familyId?: number;
  } | null;
  if (!decoded) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // ✅ Monta filtro de data inclusivo: [start, end+1d)
  let dateFilter: any = undefined;
  if (start && end) {
    // começo do dia inicial (local)
    const startDate = new Date(`${start}T00:00:00`);
    // primeiro instante do dia seguinte ao 'end'
    const endExclusive = new Date(`${end}T00:00:00`);
    endExclusive.setDate(endExclusive.getDate() + 1);

    dateFilter = { gte: startDate, lt: endExclusive };
  }

  // ✅ Monte seu where preservando filtros já existentes (ex.: familyId/owner)
  const where: any = {
    ...(dateFilter ? { date: dateFilter } : {}),
    // Exemplo (ajuste conforme seu schema):
    // userId: decoded.id,
    // familyId: decoded.familyId,
  };

  const finances = await prisma.finance.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(finances);
}
