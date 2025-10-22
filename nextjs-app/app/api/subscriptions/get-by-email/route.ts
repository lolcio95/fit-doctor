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

  const { email } = await req.json();

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];

    if (!customer) {
      return NextResponse.json({ error: "Nie znaleziono klienta" }, { status: 404 });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 5,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ message: "Brak aktywnych subskrypcji" });
    }

    return NextResponse.json({
      subscriptions: subscriptions.data.map((s) => ({
        id: s.id,
        status: s.status,
        price: s.items.data[0].price.id,
      })),
    });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}