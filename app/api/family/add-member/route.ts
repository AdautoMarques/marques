import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("auth_token=")[1]
    ?.split(";")[0];
  const decoded = verifyToken(token || "") as { familyId?: number } | null;
  if (!decoded?.familyId)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Preencha nome, email e senha." },
      { status: 400 }
    );
  }

  const count = await prisma.user.count({
    where: { familyId: decoded.familyId },
  });
  if (count >= 3) {
    return NextResponse.json(
      { error: "Limite de 3 usuários por família atingido." },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { error: "Este e-mail já está em uso." },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      familyId: decoded.familyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      familyId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, user });
}
