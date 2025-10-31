import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/app/utils/mailer";
import { recordPayment } from "./utils/recordPyament"; // Twój util
import {prisma} from "@/lib/prisma"


export const config = {
  api: {
    bodyParser: false,
  },
};


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  async function sendStatusEmail({
    to,
    subject,
    html,
  }: {
    to: string | string[];
    subject: string;
    html: string;
  }) {
    try {
      await sendEmail({
        to,
        from: `Fit Doctor <${process.env.NEXT_PUBLIC_EMAIL_FROM}>`,
        subject,
        html,
      });
    } catch (mailErr) {
      console.error(`❌ Błąd wysyłania maila [${subject}]:`, mailErr);
    }
  }

  const adminEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  try {
    switch (event.type) {
      // === 1️⃣ Pierwsza płatność / zakup ===
      case "checkout.session.completed": {
        console.log('***************************')
        console.log('CHECKOUT_SESSION_COMPLETED')
        console.log('***************************')
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email;
        const amount = (session.amount_total ?? 0) / 100;
        const currency = session.currency?.toUpperCase() ?? "PLN";
        const mode = session.mode; // "payment" | "subscription"

        let productName = "Nieznany produkt";
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            limit: 1,
          });
          const item = lineItems.data[0];
          if (item?.description) {
            productName = item.description;
          } else if (item?.price?.product) {
            const product = item.price.product as Stripe.Product | string | undefined;
            if (product && typeof product !== "string" && "name" in product && product.name) {
              productName = product.name;
            }
          }
        } catch (err) {
          console.error("⚠️ Nie udało się pobrać line_items:", err);
        }

        const isSubscription = mode === "subscription";
        const userSubject = "Dziękujemy za zakup planu";

        const userHtml = `
          <p>Cześć!</p>
          <p>Dziękujemy za zakup planu <b>${productName}</b> 🎉</p>
          <p>Kwota: <b>${amount} ${currency}</b></p>
          <p>Wkrótce się do Ciebie odezwiemy 💪</p>
        `;

        const adminSubject = "Nowa płatność jednorazowa";

        // Pobierz dane użytkownika
        let phone: string | null = null;
        let userId: string | null = null;

        if (email) {
          const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, phone: true },
          });
          phone = user?.phone ?? (session.metadata?.phone as string) ?? null;
          userId = user?.id ?? null;
        }

        // 💾 Zapisz płatność
        if(session.mode !== "subscription"){
          await recordPayment({
            email,
            phone,
            userId,
            productName,
            paymentType: isSubscription ? "subscription" : "one-time",
            amount: session.amount_total ?? null,
            currency,
            source: "checkout.session.completed",
            externalId: session.id,
            metadata: session.metadata ?? {},
            notes: isSubscription ? "Zakup nowej subskrypcji" : "Zakup jednorazowy",
          });
        }

        const adminHtml = `
          <p>Użytkownik <a href="mailto:${email}">${email}</a> zakupił ${
          isSubscription ? "subskrypcję" : "plan jednorazowy"
        } <b>${productName}</b>.</p>
          <p>Kwota: <b>${amount} ${currency}</b></p>
          ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
        `;

        if (email && session.mode !== "subscription") {
          await sendStatusEmail({ to: email, subject: userSubject, html: userHtml });
          if (adminEmails.length > 0) {
            await sendStatusEmail({
              to: adminEmails,
              subject: adminSubject,
              html: adminHtml,
            });
          }
        }

        break;
      }

      // === 2️⃣ Odnowienie subskrypcji ===
      case "invoice.payment_succeeded": {
        console.log('***************************')
        console.log('INVOICE_PAYMENT_SUCCEEEDED')
        console.log('***************************')
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscriptionId = (invoice as any).subscription as string | null;

        // Pobierz email klienta
        let customerEmail: string | null = null;
        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && typeof customer !== "string" && "email" in customer) {
            customerEmail = (customer.email as string) ?? null;
          }
        } catch (err) {
          console.warn("⚠️ Nie udało się pobrać klienta Stripe:", err);
        }

        // Pobierz usera z DB
        let phone: string | null = null;
        let userId: string | null = null;
        if (customerEmail) {
          const user = await prisma.user.findUnique({
            where: { email: customerEmail },
            select: { id: true, phone: true },
          });
          phone = user?.phone ?? null;
          userId = user?.id ?? null;
        }

        // Pobierz nazwę produktu
        let productName = "Subskrypcja";
        try {
          if (subscriptionId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId, {
              expand: ["items.data.price.product"],
            });
            const item = sub.items.data[0];
            const prod = item?.price?.product;
            if (prod && typeof prod !== "string" && "name" in prod) {
              productName = prod.name as string;
            } else if (item?.price?.nickname) {
              productName = item.price.nickname;
            }
          }
        } catch (err) {
          console.warn("⚠️ Nie udało się pobrać subskrypcji:", err);
        }

        const amount = invoice.amount_paid;
        const currency = invoice.currency?.toUpperCase() ?? "PLN";

        const billingReason = invoice.billing_reason ?? "manual";

        // 💾 Zapisz płatność
        await recordPayment({
          email: customerEmail,
          phone,
          userId,
          productName,
          paymentType: "subscription",
          amount,
          currency,
          source: "invoice.payment_succeeded",
          externalId: invoice.id,
          metadata: invoice.metadata ?? {},
          notes: billingReason === 'subscription_create' ? "Zakup nowej subskrypcji" : "Automatyczne odnowienie subskrypcji",
        });

        // ✉️ Maile
        const userSubject = billingReason === 'subscription_create' ? "Twoja subskrypcja została pomyślnie zakupiona 🎉" : "Twoja subskrypcja została automatycznie odnowiona 🎉";
        const userHtml = `
          <p>Cześć!</p>
          <p>Twoja subskrypcja <b>${productName}</b> została pomyślnie odnowiona.</p>
          <p>Pobrano kwotę: <b>${(amount / 100).toFixed(2)} ${currency}</b>.</p>
          <p>${billingReason === 'subscription_cycle' && 'Dziękujemy, że nadal jesteś z nami!'} Wkrótce się do Ciebie odezwiemy 💪</p>
        `;

        const adminSubject = billingReason === 'subscription_create' ? "Nowa subskrypcja klienta" : "Odnowienie subskrypcji klienta";
        const adminHtml = `
          <p>Subskrypcja użytkownika <a href="mailto:${customerEmail}">${customerEmail}</a> ${billingReason === 'subscription_create' ? "została zakupiona" : "została odnowiona"}.</p>
          <p>Produkt: <b>${productName}</b></p>
          <p>Kwota: <b>${(amount / 100).toFixed(2)} ${currency}</b></p>
          ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
          <p>Billing reason: ${billingReason}</p>
        `;

        if (customerEmail) {
          await sendStatusEmail({ to: customerEmail, subject: userSubject, html: userHtml });
        }
        if (adminEmails.length > 0) {
          await sendStatusEmail({ to: adminEmails, subject: adminSubject, html: adminHtml });
        }

        break;
      }

      // === 3️⃣ Update subskrypcji (zmiana planu) ===
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        let customerEmail: string | null = null;

        try {
          if (subscription.customer) {
            const customer = await stripe.customers.retrieve(subscription.customer as string);
            if (customer && typeof customer !== "string" && "email" in customer) {
              customerEmail = (customer.email as string) ?? null;
            }
          }
        } catch (err) {
          console.warn("⚠️ Nie udało się pobrać klienta Stripe:", err);
        }

        let newPlanName = "Subskrypcja zaktualizowana";
        let recurringPriceStr = "";
        try {
          const item = subscription.items.data[0];
          if (item?.price) {
            const price = item.price;
            if (typeof price.unit_amount === "number") {
              recurringPriceStr = ` (${(price.unit_amount / 100).toFixed(2)} ${price.currency?.toUpperCase()})`;
            }
            if (price.nickname) {
              newPlanName = price.nickname;
            }
          }
        } catch (err) {
          console.warn("⚠️ Nie udało się odczytać informacji o cenie subskrypcji:", err);
        }

        const userSubject = "Twoja subskrypcja została zaktualizowana";
        const userHtml = `
          <p>Cześć!</p>
          <p>Twoja subskrypcja została zaktualizowana na <b>${newPlanName}</b>${recurringPriceStr}.</p>
        `;

        const adminSubject = "Aktualizacja subskrypcji użytkownika";
        const adminHtml = `
          <p>Użytkownik <a href="mailto:${customerEmail}">${customerEmail}</a> zaktualizował subskrypcję na <b>${newPlanName}</b>${recurringPriceStr}.</p>
        `;

        // if (customerEmail) {
        //   await sendStatusEmail({ to: customerEmail, subject: userSubject, html: userHtml });
        // }
        // if (adminEmails.length > 0) {
        //   await sendStatusEmail({ to: adminEmails, subject: adminSubject, html: adminHtml });
        // }

        break;
      }

      default:
        console.log(`ℹ️ Nieobsługiwany event: ${event.type}`);
    }
  } catch (err) {
    console.error("❌ Błąd podczas obsługi webhooka:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}