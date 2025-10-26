import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ o id vem corretamente agora

  if (!id) {
    return NextResponse.json({ error: "ID não informado." }, { status: 400 });
  }

  const token = req.headers
    .get("cookie")
    ?.split("auth_token=")[1]
    ?.split(";")[0];
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const token = req.headers
    .get("cookie")
    ?.split("auth_token=")[1]
    ?.split(";")[0];
  const decoded = verifyToken(token || "");
  if (!decoded || typeof decoded !== "object") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  await prisma.finance.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "Lançamento removido com sucesso" });
}
