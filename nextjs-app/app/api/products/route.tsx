import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

export async function GET() {
  try {
    const products = await stripe.products.list({
      expand: ["data.default_price"],
      active: true,
    });

    const formatted = products.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.images?.[0],
      price: (product.default_price as Stripe.Price)?.unit_amount,
      currency: (product.default_price as Stripe.Price)?.currency,
      priceId: (product.default_price as Stripe.Price)?.id,
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
