import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout realizado com sucesso." });
  res.cookies.set("auth_token", "", { httpOnly: true, maxAge: 0 }); // apaga cookie
  return res;
}
