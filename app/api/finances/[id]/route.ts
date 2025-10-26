import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const token = req.cookies.get("auth_token")?.value;
  const decoded = verifyToken(token || "");

  if (!decoded || typeof decoded !== "object") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { type, category, description, value, date } = await req.json();

  const finance = await prisma.finance.update({
    where: { id: Number(id) },
    data: { type, category, description, value, date: new Date(date) },
  });

  return NextResponse.json(finance);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const token = req.cookies.get("auth_token")?.value;
  const decoded = verifyToken(token || "");

  if (!decoded || typeof decoded !== "object") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  await prisma.finance.delete({ where: { id: Number(id) } });

  return NextResponse.json({ message: "Lançamento removido com sucesso" });
}
