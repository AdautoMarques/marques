import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado." },
      { status: 404 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const token = signToken({ id: user.id, familyId: user.familyId });

  const res = NextResponse.json({ message: "Login bem-sucedido", user });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
