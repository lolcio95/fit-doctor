import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const paymentId = url.searchParams.get("paymentId");
  if (!paymentId) return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });

  try {
    const files = await prisma.paymentFile.findMany({
      where: { paymentId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ files });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not fetch files" }, { status: 500 });
  }
}