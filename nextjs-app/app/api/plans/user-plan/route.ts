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
    // find customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];

    if (!customer) {
      return NextResponse.json({ error: "Nie znaleziono klienta" }, { status: 404 });
    }

    // find active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      expand: ["data.items.data.price"],
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ message: "Brak aktywnej subskrypcji" });
    }

    // get the first active subscription
    const sub = subscriptions.data[0];
    const item = sub.items.data[0];
    const price = item.price;
    const productId = price.product as string;

    // Get product details
    const product = await stripe.products.retrieve(productId);
    

    // Return user plan details
    return NextResponse.json({
      subscriptionId: sub.id,
      subscriptionItemId: item.id,
      plan: {
        id: product.id,
        name: product.name,
        description: product.description,
        priceId: price.id,
        price: (price.unit_amount || 0) / 100,
        currency: price.currency,
        interval: price.recurring?.interval,
      },
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}