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

  try {
    const { subscriptionId, subscriptionItemId, newPriceId } = await req.json();

    if (!subscriptionId || !subscriptionItemId || !newPriceId) {
      return NextResponse.json(
        { error: "Brak wymaganych parametrów" },
        { status: 400 }
      );
    }

    // 🧾 Aktualizacja planu użytkownika
    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations", // 💡 naliczy proporcjonalną różnicę między planami
    });

    // 💡 Możesz opcjonalnie rozwinąć cenę, żeby od razu znać nazwę nowego planu
    const updatedWithPrice = await stripe.subscriptions.retrieve(updated.id, {
      expand: ["items.data.price.product"],
    });

    const newItem = updatedWithPrice.items.data[0];
    const newPrice = newItem.price;
    const newProduct = newPrice.product as Stripe.Product;

    return NextResponse.json({
      success: true,
      subscriptionId: updated.id,
      newPlan: {
        name: newProduct.name,
        price: (newPrice.unit_amount ?? 0) / 100,
        currency: newPrice.currency,
        interval: newPrice.recurring?.interval,
      },
    });
  } catch (err: any) {
    console.error("Stripe update error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
