import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = ["TO_PROCESS", "PROCESSING", "PROCESSED"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as any).role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) return new NextResponse(JSON.stringify({ error: "Invalid id" }), { status: 400 });

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!payment) return new NextResponse(JSON.stringify({ error: "Not found" }), { status: 404 });

    return NextResponse.json({ payment });
  } catch (err: any) {
    console.error("GET /api/admin/orders/[id] error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as any).role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) return new NextResponse(JSON.stringify({ error: "Invalid id" }), { status: 400 });

    const body = await req.json();
    const { orderStatus } = body as { orderStatus?: string };

    if (!orderStatus || !ALLOWED_STATUSES.includes(orderStatus as AllowedStatus)) {
      return new NextResponse(JSON.stringify({ error: "Invalid orderStatus" }), { status: 400 });
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: { orderStatus: orderStatus as AllowedStatus },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({ payment: updated });
  } catch (err: any) {
    console.error("PATCH /api/admin/orders/[id] error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}