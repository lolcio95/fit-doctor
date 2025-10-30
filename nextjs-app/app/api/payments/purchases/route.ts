import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
    }

    const email = session.user.email;
    // parse params
    const url = new URL(req.url);
    const limitParam = Number(url.searchParams.get("limit") ?? 10);
    const startingAfter = url.searchParams.get("starting_after") ?? undefined;
    const limit = Math.max(1, Math.min(100, isNaN(limitParam) ? 10 : limitParam));

    // Find user to get userId (if stored)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    const userId = user?.id ?? null;

    // Build where clause: prefer userId, fallback to email
    const where: any = userId
      ? { userId }
      : { email };

    // We will request limit + 1 items to detect if there's more
    const take = limit + 1;

    // Build Prisma query with optional cursor
    const query: any = {
      where,
      orderBy: { createdAt: "desc" },
      take,
    };

    if (startingAfter) {
      // Use cursor pagination by id. For MongoDB prisma client expects { id: "<value>" }
      query.cursor = { id: startingAfter };
      // For cursor pagination, to start AFTER the cursor item, we need to use `skip: 1`
      query.skip = 1;
    }

    const rows = await prisma.payment.findMany(query);

    // Determine hasMore and prepare results (limit entries)
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    // Map to API-friendly shape
    const purchases = items.map((r: any) => {
      // receipt_url may be in metadata or notes — keep consistent with previous API shape
      const receipt_url = (r.metadata && (r.metadata.receipt_url || r.metadata.receiptUrl)) ?? null;
      return {
        id: r.id,
        productName: r.productName ?? null,
        paymentType: r.paymentType === "subscription" ? "subscription" : "one-time",
        amount: r.amount ?? 0,
        currency: r.currency ?? null,
        receipt_url,
        created: Math.floor(new Date(r.createdAt).getTime() / 1000),
        raw: {
          // include some raw data for admin or debugging (optional)
          email: r.email ?? null,
          phone: r.phone ?? null,
          source: r.source ?? null,
          metadata: r.metadata ?? null,
          notes: r.notes ?? null,
        },
      };
    });

    const nextStartingAfter = items.length > 0 ? items[items.length - 1].id : null;

    return NextResponse.json({ purchases, hasMore, nextStartingAfter }, { status: 200 });
  } catch (err) {
    console.error("GET /api/payments/purchases (db) error:", err);
    return NextResponse.json({ error: "Coś poszło nie tak." }, { status: 500 });
  }
}