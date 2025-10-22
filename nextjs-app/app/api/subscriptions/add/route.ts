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

  const { priceId, email } = await req.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    // payment_method_types: ["card", "blik"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
  });

  return NextResponse.json({ url: session.url });
}

// pobieranie danych po powrocie z checkout:
// const session = await stripe.checkout.sessions.retrieve(sessionId, {
//   expand: ["subscription"],
// });

// console.log(session.subscription);