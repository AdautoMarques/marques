import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("auth_token=")[1]
    ?.split(";")[0];
  const decoded = verifyToken(token || "") as { familyId?: number } | null;
  if (!decoded?.familyId)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const members = await prisma.user.findMany({
    where: { familyId: decoded.familyId },
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ members, limit: 3, count: members.length });
}
