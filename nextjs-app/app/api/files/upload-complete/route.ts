import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { paymentId, key, filename, mimetype, size } = body || {};

  if (!paymentId || !key || !filename) {
    return NextResponse.json({ error: "paymentId, key and filename are required" }, { status: 400 });
  }

  try {
    const file = await prisma.paymentFile.create({
      data: {
        payment: { connect: { id: paymentId } },
        key,
        filename,
        mimetype: mimetype ?? undefined,
        size: size ? Number(size) : undefined,
        uploadedBy: session.user.id,
      },
    });
    return NextResponse.json({ file }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save file metadata" }, { status: 500 });
  }
}