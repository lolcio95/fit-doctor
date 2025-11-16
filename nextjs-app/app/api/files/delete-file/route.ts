import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions"; // dopasuj ścieżkę
import { deleteFromS3 } from "@/lib/s3client";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { id, key } = body || {};
  if (!id || !key) return NextResponse.json({ error: "Missing id or key" }, { status: 400 });

  try {
    await deleteFromS3(key);
    await prisma.paymentFile.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete-file error", err);
    return NextResponse.json({ error: "Could not delete file" }, { status: 500 });
  }
}