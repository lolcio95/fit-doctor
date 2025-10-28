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

  const { priceId, email, phone } = await req.json();

  try {
    if (phone) {
      try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.phone !== phone) {
          await prisma.user.update({
            where: { email },
            data: { phone },
          });
        }
      } catch (err) {
        console.warn("Unable to update user phone:", err);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      metadata: {
        phone: phone ?? "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("POST /api/subscriptions/add error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}