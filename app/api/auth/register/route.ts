import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Preencha todos os campos." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "E-mail já cadastrado." },
      { status: 400 }
    );
  }

  const family = await prisma.family.create({
    data: { name: `${name.split(" ")[0]} Family` },
  });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      familyId: family.id,
    },
  });

  const token = signToken({ id: user.id, familyId: family.id });

  const res = NextResponse.json({
    message: "Usuário criado com sucesso!",
    user,
  });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
