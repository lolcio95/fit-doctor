import { NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/lib/s3client"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const urlObj = new URL(req.url);
  const key = urlObj.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  try {
    const url = await getPresignedDownloadUrl(key, 60 * 10);
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create download url" }, { status: 500 });
  }
}