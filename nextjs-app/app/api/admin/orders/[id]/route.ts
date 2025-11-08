import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma, OrderStatus } from "@prisma/client";

const PAGE_SIZE = 20;
const ALLOWED_STATUSES = ["TO_PROCESS", "PROCESSING", "PROCESSED"] as const;
type AllowedStatus = typeof ALLOWED_STATUSES[number];

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as any).role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const statusParam = url.searchParams.get("status") ?? "";
    const skip = (page - 1) * PAGE_SIZE;
    const take = PAGE_SIZE + 1;

    let where: Prisma.PaymentWhereInput | undefined = undefined;
    if (statusParam && ALLOWED_STATUSES.includes(statusParam as AllowedStatus)) {
      where = { orderStatus: statusParam as unknown as OrderStatus };
    }

    const fetched = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const hasMore = fetched.length > PAGE_SIZE;
    const orders = hasMore ? fetched.slice(0, PAGE_SIZE) : fetched;

    return NextResponse.json({ orders, hasMore });
  } catch (err: any) {
    console.error("GET /api/admin/orders error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}