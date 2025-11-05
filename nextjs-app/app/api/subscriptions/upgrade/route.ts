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

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const oldPrice = await stripe.prices.retrieve(subscription.items.data[0].plan.id ?? '');

    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations",
    });

    const customerId = updatedSubscription.customer as string;
    if (!customerId) {
      return NextResponse.json(
        { error: "Subskrypcja nie ma przypisanego klienta." },
        { status: 500 }
      );
    }

    const customer = await stripe.customers.retrieve(customerId);
    const defaultPm = (customer as any).invoice_settings?.default_payment_method;

    let paymentMethodToUse: string | null = defaultPm ?? null;

    if (!paymentMethodToUse) {
      const pmList = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
        limit: 1,
      });

      if (pmList.data.length > 0) {
        paymentMethodToUse = pmList.data[0].id;
        await stripe.customers.update(customerId, {
          invoice_settings: { default_payment_method: paymentMethodToUse },
        });
      }
    }

    if (!paymentMethodToUse) {
      return NextResponse.json(
        {
          error:
            "Brak zapisanej metody płatności. Użytkownik musi dodać kartę w panelu płatności.",
        },
        { status: 402 }
      );
    }
    
    const invoice = await stripe.invoices.create({
      customer: customerId,
      pending_invoice_items_behavior: "include",
      collection_method: "charge_automatically",
      metadata: {
        action: 'UPDATE_SUBSCRIPTION',
        oldPrice: oldPrice.id,
        newPrice: newPriceId,
      }
    });

    const paidInvoice = await stripe.invoices.pay(invoice.id, {
      payment_method: paymentMethodToUse,
    });

    const refreshed = await stripe.subscriptions.retrieve(updatedSubscription.id, {
      expand: ["items.data.price.product"],
    });

    const newItem = refreshed.items.data[0];
    const newPrice = newItem.price;
    const newProduct = newPrice.product as Stripe.Product;

    return NextResponse.json({
      success: true,
      subscriptionId: refreshed.id,
      newPlan: {
        name: newProduct.name,
        price: (newPrice.unit_amount ?? 0) / 100,
        currency: newPrice.currency,
        interval: newPrice.recurring?.interval,
      },
      invoice: {
        id: paidInvoice.id,
        amount_paid: paidInvoice.amount_paid / 100,
        currency: paidInvoice.currency,
        status: paidInvoice.status,
      },
    });
  } catch (err: any) {
    console.log('error podczas updatu: ', err);
    console.error("Stripe update error:", err);
    return NextResponse.json(
      { error: err.message || "Błąd podczas aktualizacji subskrypcji." },
      { status: 500 }
    );
  }
}