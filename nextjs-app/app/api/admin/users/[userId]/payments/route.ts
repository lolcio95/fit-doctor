import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;
const ALLOWED_STATUSES = ["TO_PROCESS", "PROCESSING", "PROCESSED"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function GET(req: NextRequest, ctx?: any) {
  try {
    // auth: only ADMIN
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as any).role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // IMPORTANT: params can be a Promise in some Next.js runtimes,
    // so await it before reading properties to avoid the runtime error.
    let userId: string | undefined;

    try {
      const paramsObj = ctx?.params ? await ctx.params : undefined;
      if (paramsObj && typeof paramsObj.userId === "string") {
        userId = paramsObj.userId;
      }
    } catch (e) {
      // ignore - we'll fallback to parsing the URL below
    }

    // fallback: parse from URL path if params unavailable
    if (!userId) {
      try {
        const url = new URL(req.url);
        const parts = url.pathname.split("/").filter(Boolean); // ['api','admin','users','<userId>','payments']
        const usersIndex = parts.findIndex((p) => p === "users");
        if (usersIndex !== -1 && parts.length > usersIndex + 1) {
          userId = parts[usersIndex + 1];
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Missing userId" }), { status: 400 });
    }

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const statusParam = url.searchParams.get("status") ?? "";
    const skip = (page - 1) * PAGE_SIZE;
    const take = PAGE_SIZE + 1; // fetch one extra for hasMore

    const where: any = { userId };
    if (statusParam && ALLOWED_STATUSES.includes(statusParam as AllowedStatus)) {
      where.orderStatus = statusParam;
    }

    const fetched = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    const hasMore = fetched.length > PAGE_SIZE;
    const payments = hasMore ? fetched.slice(0, PAGE_SIZE) : fetched;

    const [toProcess, processing, processed, total] = await Promise.all([
      prisma.payment.count({ where: { userId, orderStatus: "TO_PROCESS" as AllowedStatus } }),
      prisma.payment.count({ where: { userId, orderStatus: "PROCESSING" as AllowedStatus } }),
      prisma.payment.count({ where: { userId, orderStatus: "PROCESSED" as AllowedStatus } }),
      prisma.payment.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      payments,
      hasMore,
      counts: { TO_PROCESS: toProcess, PROCESSING: processing, PROCESSED: processed },
      total,
    });
  } catch (err: any) {
    console.error("GET /api/admin/users/[userId]/payments error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}