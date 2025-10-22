import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  const serverSession = await getServerSession(authOptions);
  if (!serverSession || !serverSession.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const { subscriptionId } = await req.json();

  try {
    const deleted = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({
      canceled: true,
      subscriptionId: deleted.id,
      cancelAt: deleted.cancel_at_period_end,
    });
  } catch (err: any) {
    console.error("Stripe cancel error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}