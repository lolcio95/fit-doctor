import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token as any).role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    const [toProcess, processing, processed, total] = await Promise.all([
      prisma.payment.count({ where: { orderStatus: "TO_PROCESS" as OrderStatus } }),
      prisma.payment.count({ where: { orderStatus: "PROCESSING" as OrderStatus } }),
      prisma.payment.count({ where: { orderStatus: "PROCESSED" as OrderStatus } }),
      prisma.payment.count({ where: {} }),
    ]);

    return NextResponse.json({
      counts: {
        TO_PROCESS: toProcess,
        PROCESSING: processing,
        PROCESSED: processed,
      },
      total,
    });
  } catch (err: any) {
    console.error("GET /api/admin/orders/meta error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}