import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("auth_token=")[1]
    ?.split(";")[0];
  const decoded = verifyToken(token || "") as {
    familyId?: number;
    id?: number;
  } | null;

  if (!decoded?.familyId)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { memberId } = await req.json();

  // Impedir exclusão de si mesmo
  if (decoded.id === memberId) {
    return NextResponse.json(
      { error: "Você não pode remover a si mesmo." },
      { status: 400 }
    );
  }

  // Verifica se o membro pertence à mesma família
  const member = await prisma.user.findUnique({ where: { id: memberId } });
  if (!member || member.familyId !== decoded.familyId) {
    return NextResponse.json(
      { error: "Usuário não pertence à sua família." },
      { status: 403 }
    );
  }

  await prisma.user.delete({ where: { id: memberId } });

  return NextResponse.json({
    ok: true,
    message: "Membro removido com sucesso.",
  });
}
