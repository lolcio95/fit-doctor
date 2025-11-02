import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/authOptions";

const prisma = new PrismaClient();

// Server-side normalization/validation:
const phoneDisplayRegex =
  /^(?:\+48\s?\d{3}\s?\d{3}\s?\d{3}|\d{3}\s?\d{3}\s?\d{3})$/;

const normalizePhoneForSending = (display: string | undefined): string | undefined => {
  if (!display) return undefined;
  const trimmed = display.trim();
  if (!trimmed) return undefined;
  const noSpaces = trimmed.replace(/\s+/g, "");
  const hasPlus = noSpaces.startsWith("+");
  const digits = noSpaces.replace(/\D/g, "");
  if (!digits) return undefined;
  if (hasPlus) {
    if (!digits.startsWith("48")) return undefined;
    return `+${digits}`;
  } else {
    return `+48${digits}`;
  }
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const phone = body?.phone;
    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Missing phone" }, { status: 400 });
    }

    const trimmed = phone.trim();
    if (!phoneDisplayRegex.test(trimmed)) {
      return NextResponse.json(
        {
          error:
            "Numer telefonu może być napisany tylko w takim formacie +48 123 456 789 lub 123 456 789",
        },
        { status: 400 }
      );
    }

    const normalized = normalizePhoneForSending(trimmed);
    if (!normalized) {
      return NextResponse.json({ error: "Nieprawidłowy numer telefonu" }, { status: 400 });
    }

    // Update user by email
    await prisma.user.updateMany({
      where: { email: session.user.email },
      data: { phone: normalized },
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, phone: true, name: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch (err) {
    console.error("change-phone-number POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}