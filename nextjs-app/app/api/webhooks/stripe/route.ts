import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/app/utils/mailer";

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

  switch (event.type) {
  case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email;
      const amount = (session.amount_total ?? 0) / 100;
      const currency = session.currency?.toUpperCase() ?? "PLN";
      const mode = session.mode; // "payment" | "subscription"
      const adminEmails =
        process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

      let productName = "Nieznany produkt";
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 1,
        });
        const item = lineItems.data[0];
        if (item?.description) {
          productName = item.description;
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

      const adminHtml = isSubscription
        ? `
          <p>Użytkownik <a href="mailto:${email}">${email}</a> zakupił subskrypcję <b>${productName}</b>.</p>
          <p>Kwota: <b>${amount} ${currency}</b></p>
        `
        : `
          <p>Użytkownik <a href="mailto:${email}">${email}</a> zakupił plan jednorazowy <b>${productName}</b>.</p>
          <p>Kwota: <b>${amount} ${currency}</b></p>
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

    default:
      console.log(`ℹ️ Nieobsługiwany event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}