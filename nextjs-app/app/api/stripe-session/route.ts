import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");
  if (!session_id) {
    return NextResponse.json({ error: "missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent", "line_items.data.price.product", "subscription", "customer"],
    });

    // Determine success
    let success = false;
    let message = "Płatność nie została jeszcze potwierdzona.";

    if (session.mode === "payment") {
      if (session.payment_status === "paid") {
        success = true;
        message = "Płatność zakończona pomyślnie.";
      }
    } else if (session.mode === "subscription") {
      // subscription may be string or expanded object
      const sub = session.subscription;
      if (sub && typeof sub !== "string") {
        if (["active", "trialing"].includes(sub.status)) {
          success = true;
          message = "Subskrypcja aktywna.";
        } else {
          message = `Status subskrypcji: ${sub.status}`;
        }
      } else {
        // fallback: check payment_status or default
        if (session.payment_status === "paid") {
          success = true;
          message = "Płatność subskrypcji zakończona pomyślnie.";
        }
      }
    }

    // Try to read some helpful fields for the client
    const amount = typeof session.amount_total === "number" ? session.amount_total / 100 : undefined;
    const currency = session.currency?.toUpperCase();
    let productName: string | undefined = undefined;
    try {
      const item = (session as any).line_items?.data?.[0];
      if (item) {
        if (item.description) productName = item.description;
        else if (item.price && item.price.product && typeof item.price.product !== "string" && item.price.product.name) {
          productName = item.price.product.name;
        } else if (item.price?.nickname) {
          productName = item.price.nickname;
        }
      }
    } catch {
      // ignore
    }

    return NextResponse.json({
      success,
      message,
      session: {
        id: session.id,
        mode: session.mode,
        customer_email: session.customer_email,
        amount,
        currency,
        productName,
      },
    });
  } catch (err) {
    console.error("Błąd pobierania sesji ze Stripe:", err);
    return NextResponse.json({ error: "stripe_error" }, { status: 500 });
  }
}