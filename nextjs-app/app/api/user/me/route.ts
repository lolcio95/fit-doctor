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
      select: { id: true, email: true, phone: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });
    }

    const googleAccount = await prisma.account.findFirst({
      where: { userId: user.id, provider: "google" },
      select: { provider: true },
    });

    const hasGoogleAccount = Boolean(googleAccount);

    return NextResponse.json({ hasGoogleAccount, ...user});
  } catch (err) {
    console.error("GET /api/user/me error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}