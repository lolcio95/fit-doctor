import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/app/utils/mailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email;
        const amount = (session.amount_total ?? 0) / 100;
        const currency = session.currency?.toUpperCase() ?? "PLN";
        const mode = session.mode; // "payment" | "subscription"

        // Try to resolve product name from line items
        let productName = "Nieznany produkt";
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            limit: 1,
          });
          const item = lineItems.data[0];
          if (item?.description) {
            productName = item.description;
          } else if (item?.price?.product) {
            // if product expanded, try to read name
            const product = item.price.product as Stripe.Product | string | undefined;
            if (product && typeof product !== "string" && "name" in product && product.name) {
              productName = product.name;
            }
          }
        } catch (err) {
          console.error("⚠️ Nie udało się pobrać line_items:", err);
        }

        const isSubscription = mode === "subscription";
        const userSubject = isSubscription
          ? "Dziękujemy za zakup subskrypcji 💪"
          : "Dziękujemy za zakup planu 💪";

        const userHtml = isSubscription
          ? `
            <p>Cześć!</p>
            <p>Dziękujemy za zakup subskrypcji <b>${productName}</b> 🎉</p>
            <p>Twoja płatność w wysokości <b>${amount} ${currency}</b> została pomyślnie przetworzona.</p>
            <p>Wkrótce odezwie się do Ciebie nasz trener 💪</p>
          `
          : `
            <p>Cześć!</p>
            <p>Dziękujemy za zakup planu <b>${productName}</b> 🎉</p>
            <p>Twoja płatność w wysokości <b>${amount} ${currency}</b> została pomyślnie przetworzona.</p>
            <p>Wkrótce odezwie się do Ciebie nasz trener 💪</p>
          `;

        const adminSubject = isSubscription
          ? "Nowa subskrypcja użytkownika"
          : "Nowa płatność jednorazowa";

        // Try to fetch user from DB to get phone (or fallback to session metadata)
        let phoneFromDb: string | null = null;
        try {
          if (email) {
            const user = await prisma.user.findUnique({
              where: { email },
              select: { phone: true },
            });
            phoneFromDb = user?.phone ?? null;
          }
        } catch (err) {
          console.warn("⚠️ Nie udało się pobrać użytkownika z DB:", err);
        }

        // fallback: try session metadata.phone
        const phoneFromSessionMetadata = (session.metadata?.phone as string) ?? null;
        const phone = phoneFromDb ?? phoneFromSessionMetadata ?? null;

        const adminHtml = isSubscription
          ? `
            <p>Użytkownik <a href="mailto:${email}">${email}</a> zakupił subskrypcję <b>${productName}</b>.</p>
            <p>Kwota: <b>${amount} ${currency}</b></p>
            ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
          `
          : `
            <p>Użytkownik <a href="mailto:${email}">${email}</a> zakupił plan jednorazowy <b>${productName}</b>.</p>
            <p>Kwota: <b>${amount} ${currency}</b></p>
            ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
          `;

        if (email) {
          await sendStatusEmail({
            to: email,
            subject: userSubject,
            html: userHtml,
          });

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

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email;

        if (email) {
          await sendStatusEmail({
            to: email,
            subject: "Nieudana płatność",
            html: `
              <p>Cześć!</p>
              <p>Twoja płatność nie została zakończona pomyślnie 😞</p>
              <p>Jeśli chcesz spróbować ponownie, możesz przejść do strony zakupu i wykonać płatność jeszcze raz.</p>
            `,
          });
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email;

        if (email) {
          await sendStatusEmail({
            to: email,
            subject: "Sesja płatności wygasła",
            html: `
              <p>Cześć!</p>
              <p>Twoja sesja płatności wygasła, zanim udało się ją ukończyć.</p>
              <p>Jeśli nadal chcesz sfinalizować zakup, przejdź ponownie do strony płatności i spróbuj jeszcze raz.</p>
            `,
          });
        }
        break;
      }

      // Handle subscription updates (e.g. plan upgrade/downgrade)
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Retrieve expanded subscription to get price/product info
        let expandedSub: Stripe.Subscription | null = null;
        try {
          expandedSub = await stripe.subscriptions.retrieve(subscription.id, {
            expand: ["items.data.price.product"],
          });
        } catch (err) {
          console.warn("⚠️ Nie udało się pobrać rozszerzonej subskrypcji:", err);
        }

        // Try to resolve customer email
        let customerEmail: string | null = null;
        try {
          if (subscription.customer) {
            const customer = await stripe.customers.retrieve(subscription.customer as string);
            // customer can be Customer | DeletedCustomer | Stripe.Response<...>
            // Narrow safely: check that 'email' property exists on the returned object
            if (customer && typeof customer !== "string" && "email" in customer) {
              customerEmail = (customer.email as string) ?? null;
            } else {
              customerEmail = null;
            }
          }
        } catch (err) {
          console.warn("⚠️ Nie udało się pobrać klienta Stripe:", err);
        }

        // If we still don't have email, try to read from subscription.default_payment_method / metadata (best effort)
        if (!customerEmail && subscription.metadata?.email) {
          customerEmail = subscription.metadata.email;
        }

        // Determine new product/price info
        let newPlanName = "Nowa subskrypcja";
        let recurringPriceStr = "";
        try {
          const item = expandedSub?.items?.data?.[0];
          if (item?.price) {
            const priceObj = item.price;
            // product may be expanded
            const product = priceObj.product;
            if (product && typeof product !== "string" && "name" in product && product.name) {
              newPlanName = product.name;
            } else if (priceObj.nickname) {
              newPlanName = priceObj.nickname;
            }
            if (typeof priceObj.unit_amount === "number") {
              recurringPriceStr = ` (${(priceObj.unit_amount / 100).toFixed(2)} ${priceObj.currency?.toUpperCase() ?? ""})`;
            }
          }
        } catch (err) {
          console.warn("⚠️ Nie udało się odczytać informacji o cenie subskrypcji:", err);
        }

        // Try to fetch user phone from DB by email
        let phone: string | null = null;
        if (customerEmail) {
          try {
            const user = await prisma.user.findUnique({
              where: { email: customerEmail },
              select: { phone: true },
            });
            phone = user?.phone ?? null;
          } catch (err) {
            console.warn("⚠️ Nie udało się pobrać użytkownika z DB:", err);
          }
        }

        // Compose emails
        const userSubject = "Twoja subskrypcja została zaktualizowana";
        const userHtml = `
          <p>Cześć!</p>
          <p>Twoja subskrypcja została zaktualizowana na: <b>${newPlanName}</b>${recurringPriceStr}.</p>
          <p>dziękujemy — wkrótce skontaktuje się z Tobą trener.</p>
        `;

        const adminSubject = "Aktualizacja subskrypcji użytkownika";
        const adminHtml = `
          <p>Użytkownik <a href="mailto:${customerEmail}">${customerEmail}</a> zaktualizował subskrypcję na <b>${newPlanName}</b>${recurringPriceStr}.</p>
          ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
        `;

        // Send emails
        if (customerEmail) {
          await sendStatusEmail({ to: customerEmail, subject: userSubject, html: userHtml });
        }

        if (adminEmails.length > 0) {
          await sendStatusEmail({ to: adminEmails, subject: adminSubject, html: adminHtml });
        }

        break;
      }

      default:
        console.log(`ℹ️ Nieobsługiwany event: ${event.type}`);
    }
  } catch (err) {
    console.error("❌ Błąd podczas obsługi webhooka:", err);
    // We'll return 500 to indicate processing error so Stripe can retry.
    return NextResponse.json({ error: "Server error processing webhook" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}