import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
    }

    const body = await req.json();
    const currentPassword = String(body?.currentPassword ?? "").trim();
    const newPassword = String(body?.newPassword ?? "").trim();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Wypełnij wszystkie pola." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Nowe hasło musi mieć co najmniej 8 znaków." }, { status: 400 });
    }

    const email = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });
    }

    // If user has no password set (e.g. OAuth-only), don't allow password change here
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            "To konto korzysta z logowania zewnętrznego (np. Google). Aby ustawić hasło, zaloguj się przy pomocy dostawcy zewnętrznego i skonfiguruj hasło w ustawieniach konta.",
        },
        { status: 400 }
      );
    }

    const valid = await compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Aktualne hasło jest nieprawidłowe." }, { status: 400 });
    }

    const newHashed = await hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHashed, passwordChangedAt: new Date() },
    });

    return NextResponse.json({ message: "Hasło zostało zmienione." }, { status: 200 });
  } catch (err) {
    console.error("change-password route error:", err);
    return NextResponse.json({ error: "Coś poszło nie tak." }, { status: 500 });
  }
}