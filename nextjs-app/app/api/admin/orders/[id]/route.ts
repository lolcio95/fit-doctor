import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendStatusEmail } from "@/utils/sendStatusEmail";
import { authOptions } from "@/app/api/auth/authOptions";
import { getServerSession } from "next-auth";

const ALLOWED_STATUSES = ["TO_PROCESS", "PROCESSING", "PROCESSED"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) return new NextResponse(JSON.stringify({ error: "Invalid id" }), { status: 400 });

    const body = await req.json();
    const { orderStatus } = body as { orderStatus?: string };

    if (!orderStatus || !ALLOWED_STATUSES.includes(orderStatus as AllowedStatus)) {
      return new NextResponse(JSON.stringify({ error: "Invalid orderStatus" }), { status: 400 });
    }

    // Fetch existing payment to compare previous status and get userId
    const existing = await prisma.payment.findUnique({
      where: { id },
      select: { id: true, orderStatus: true, userId: true },
    });

    if (!existing) {
      return new NextResponse(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    // Update payment and include user info in the result
    const updated = await prisma.payment.update({
      where: { id },
      data: { orderStatus: orderStatus as AllowedStatus },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // If status changed, attempt to send email to user
    if (existing.orderStatus !== orderStatus) {
      const userEmail = updated.user?.email ?? null;

      if (!userEmail && existing.userId) {
        // fallback: try to fetch user's email explicitly (just in case)
        const u = await prisma.user.findUnique({
          where: { id: existing.userId },
          select: { email: true, name: true },
        });
        if (u?.email) {
          // attach to updated.user for consistency
          (updated.user as any) = { ...(updated.user as any), email: u.email, name: u.name };
        }
      }

      const emailTo = (updated.user as any)?.email ?? null;

      if (emailTo) {
        const subject = "Status zamówienia";
        try {
          if (orderStatus === "PROCESSING") {
            const htmlProcessing = `<p>Twoje zamówienie jest przez nas analizowane!</p>`;
            await sendStatusEmail({
              to: emailTo,
              subject,
              html: htmlProcessing,
            });
            console.log('email: ', emailTo);
          } else if (orderStatus === "PROCESSED") {
            const htmlProcessed = `<p>Twoje zamówienie zostało zrealizowane!</p>`;
            await sendStatusEmail({
              to: emailTo,
              subject,
              html: htmlProcessed,
            });
            console.log('email: ', emailTo);
          } else {
            // Optionally handle TO_PROCESS or other statuses if needed
            console.log(`Status changed to ${orderStatus}, no email template configured.`);
          }
        } catch (emailErr) {
          // Log email errors but do not fail the request
          console.error("Error sending status email:", emailErr);
        }
      } else {
        console.warn(`Status changed for payment ${id} but user email not found. Skipping email.`);
      }
    }

    return NextResponse.json({ payment: updated });
  } catch (err: any) {
    console.error("PATCH /api/admin/orders/[id] error:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}