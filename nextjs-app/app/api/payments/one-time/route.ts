import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  const serverSession = await getServerSession(authOptions);
  if (!serverSession || !serverSession.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const { priceId } = await req.json();

  if (!priceId || typeof priceId !== "string") {
    return NextResponse.json({ error: "Brak priceId." }, { status: 400 });
  }

  const email = serverSession.user.email;

  try {
    let phone = "";
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { phone: true },
      });
      phone = existingUser?.phone ?? "";
    } catch (dbErr) {
      console.warn("Unable to read user phone from DB:", dbErr);
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
    const successUrl = `${base}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${base}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      payment_method_types: ["card", "p24", "blik"],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        phone: phone ?? "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("POST /api/payments/one-time error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}