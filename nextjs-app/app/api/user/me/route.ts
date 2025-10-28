import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const serverSession = await getServerSession(authOptions);
  if (!serverSession || !serverSession.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const email = serverSession.user.email;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true, phone: true, name: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/user/me error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}