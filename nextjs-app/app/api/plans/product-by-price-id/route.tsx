import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  const { priceId } = await req.json();

  try {
    const price = await stripe.prices.retrieve(priceId);

    const product = await stripe.products.retrieve(price.product as string);

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        price: price.unit_amount,
        currency: price.currency,
      },
    });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
