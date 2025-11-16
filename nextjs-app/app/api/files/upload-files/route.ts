import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3client";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // auth check
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // parse formData (Web API)
  const formData = await req.formData().catch((e) => {
    console.error("formData parse error", e);
    return null;
  });
  if (!formData) return NextResponse.json({ error: "Could not parse form data" }, { status: 400 });

  const paymentIdRaw = formData.get("paymentId");
  const paymentId = typeof paymentIdRaw === "string" ? paymentIdRaw : (paymentIdRaw ? String(paymentIdRaw) : null);
  if (!paymentId) return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });

  // files may be single or multiple; use getAll
  const fileEntries = formData.getAll("files") as File[]; // web File interface
  if (!fileEntries || fileEntries.length === 0) {
    return NextResponse.json({ error: "No files uploaded (form field name must be 'files')" }, { status: 400 });
  }

  try {
    const saved: any[] = [];

    for (const f of fileEntries) {
      const originalFilename = f.name || "file";
      const safeName = originalFilename.replace(/\s+/g, "_");
      const key = `payments/${paymentId}/${uuidv4()}_${safeName}`;

      // convert to Buffer
      const ab = await f.arrayBuffer();
      const buffer = Buffer.from(ab);

      // upload to S3
      await uploadToS3(key, buffer, f.type || undefined);

      // save metadata in DB
      const rec = await prisma.paymentFile.create({
        data: {
          payment: { connect: { id: paymentId } },
          key,
          filename: originalFilename,
          mimetype: f.type || undefined,
          size: buffer.length,
          uploadedBy: session.user.id,
        },
      });

      saved.push(rec);
    }

    return NextResponse.json({ files: saved }, { status: 201 });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}