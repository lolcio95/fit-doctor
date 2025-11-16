import { NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/lib/s3client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions"; // dostosuj ścieżkę

export async function POST(req: Request) {
  // auth - w app router getServerSession działa w server handlers
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { filename, contentType, paymentId } = body || {};

  if (!filename || !paymentId) {
    return NextResponse.json({ error: "filename and paymentId required" }, { status: 400 });
  }

  // utwórz unikalny key (możesz użyć uuid)
  const key = `payments/${paymentId}/${Date.now()}_${filename.replace(/\s+/g, "_")}`;
  

  try {
    const url = await getPresignedDownloadUrl(key, 60 * 10);
    return NextResponse.json({ url, key });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create upload url" }, { status: 500 });
  }
}