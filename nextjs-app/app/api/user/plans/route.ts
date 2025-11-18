import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { getPresignedDownloadUrl } from "@/lib/s3client";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const pageStr = url.searchParams.get("page") ?? "1";
  const pageSizeStr = url.searchParams.get("pageSize") ?? "10";
  const page = Math.max(1, parseInt(pageStr, 10) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(pageSizeStr, 10) || 10));
  const skip = (page - 1) * pageSize;

  try {
    const userId = session.user.id;

    // total count to determine hasMore
    const total = await prisma.payment.count({
      where: { userId },
    });

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { files: true },
    });

    // generate presigned URLs for each file (if any)
    const paymentsWithFileUrls = await Promise.all(
      payments.map(async (p) => {
        const filesWithUrls = await Promise.all(
          (p.files ?? []).map(async (f: any) => {
            try {
              const url = await getPresignedDownloadUrl(f.key, 60 * 10); // 10 minutes
              return { ...f, url };
            } catch (err) {
              console.error("Presigned URL error for key:", f.key, err);
              return { ...f, url: null };
            }
          })
        );
        return { ...p, files: filesWithUrls };
      })
    );

    const hasMore = skip + paymentsWithFileUrls.length < total;

    return NextResponse.json({
      payments: paymentsWithFileUrls,
      page,
      pageSize,
      hasMore,
      total,
    });
  } catch (err) {
    console.error("GET /api/user/payments error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}