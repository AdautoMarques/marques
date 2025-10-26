import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("auth_token=")[1]
    ?.split(";")[0];

  if (!token)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  const decoded = verifyToken(token) as { id: number } | null;
  if (!decoded)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({ authenticated: true, user });
}
