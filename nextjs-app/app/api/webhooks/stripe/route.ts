import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail } from "@/app/utils/mailer";
import { recordPayment } from "./utils/recordPyament";
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
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email;
        const amount = (session.amount_total ?? 0) / 100;
        const currency = session.currency?.toUpperCase() ?? "PLN";
        const mode = session.mode; // "payment" | "subscription"

        let productName = "Nieznany produkt";
        try {
          // poproś Stripe, aby rozwinął price.product dla każdego itemu
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            limit: 1,
            expand: ["data.price.product"],
          });

          const item = lineItems.data[0];
          if (item) {
            if (item.description && item.description.trim().length > 0) {
              productName = item.description;
            } else if (item.price?.product) {
              const prod = item.price.product;
              if (typeof prod !== "string" && prod && "name" in prod && prod.name) {
                productName = (prod as Stripe.Product).name;
              } else if (typeof prod === "string") {
                try {
                  const fetchedProduct = await stripe.products.retrieve(prod);
                  if (fetchedProduct && fetchedProduct.name) {
                    productName = fetchedProduct.name;
                  }
                } catch (err) {
                  console.error("⚠️ Nie udało się pobrać produktu po ID:", err);
                }
              }
            }
          }
        } catch (err) {
          console.error("⚠️ Nie udało się pobrać line_items:", err);
        }

        const isSubscription = mode === "subscription";

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

        const userSubject = "Dziękujemy za zakup planu";

        const userHtml = `
          <p>Cześć!</p>
          <p>Dziękujemy za zakup planu <b>${productName}</b> 🎉</p>
          <p>Kwota: <b>${amount} ${currency}</b></p>
          <p>Wkrótce się do Ciebie odezwiemy 💪</p>
        `;

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
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const billingReason = invoice.billing_reason;
        let productName = "Subskrypcja"; 
        let oldProductName = "Subskrypcja";
        let newProductName = "Subskrypcja";

        try {
          if(billingReason === 'subscription_create' || billingReason === 'subscription_cycle') {
            const subscription = await stripe.subscriptions.retrieve(invoice.parent?.subscription_details?.subscription as string ?? '');
            const price = await stripe.prices.retrieve(subscription.items.data[0].plan.id ?? '');
            const product = await stripe.products.retrieve(price.product as string);
            productName = product.name;
          }
          if(billingReason === 'manual' && invoice.metadata?.action === 'UPDATE_SUBSCRIPTION'){
              const oldPrice = await stripe.prices.retrieve(invoice.metadata.oldPrice);
              const oldProduct = await stripe.products.retrieve(oldPrice.product as string);
              oldProductName = oldProduct.name

              const newPrice = await stripe.prices.retrieve(invoice.metadata.newPrice);
              const newProduct = await stripe.products.retrieve(newPrice.product as string);
              newProductName = newProduct.name
          }
          
        } catch (error) {
          console.log('invoic details error: ', error);
        }

        let customerEmail: string | null = null;
        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && typeof customer !== "string" && "email" in customer) {
            customerEmail = (customer.email as string) ?? null;
          }
        } catch (err) {
          console.warn("⚠️ Nie udało się pobrać klienta Stripe:", err);
        }

        console.log('PRODUCT NAME: ', productName);




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



        const amount = invoice.amount_paid;
        const currency = invoice.currency?.toUpperCase() ?? "PLN";

        // ✉️ Maile
        // const userSubject = billingReason === 'subscription_create' ? "Twoja subskrypcja została pomyślnie zakupiona 🎉" : "Twoja subskrypcja została automatycznie odnowiona 🎉";
        let userSubject = "Nowa płatność";
        let adminSubject = "Nowa Płatność";
        let userHtml = "";
        let adminHtml = "";
        let notes = ""

        console.log('BILLING reason', billingReason);

        switch(billingReason){
          case 'subscription_create': {
            userSubject = "Twoja subskrypcja została pomyślnie zakupiona 🎉";
            adminSubject = "Nowa subskrypcja użytkownika";
            userHtml = `
              <p>Cześć!</p>
              <p>Twoja subskrypcja dla <b>${productName}</b> została utworzona.</p>
              <p>Pobrano kwotę: <b>${(amount / 100).toFixed(2)} ${currency}</b>.</p>
              <p>Wkrótce się do Ciebie odezwiemy 💪</p>
            `;
            adminHtml = `
              <p>Subskrypcja użytkownika <a href="mailto:${customerEmail}">${customerEmail}</a> została utworzona</p>
              <p>Produkt: <b>${productName}</b></p>
              <p>Kwota: <b>${(amount / 100).toFixed(2)} ${currency}</b></p>
              ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
            `;
            notes = "Zakup nowej subskrypcji";
            break;
          }
          case 'subscription_cycle': {
            userSubject = "Twoja subskrypcja została odnowiona 🎉";
            adminSubject = "Odnowienie subskrypcji użytkownika";
            userHtml = `
              <p>Cześć!</p>
              <p>Twoja subskrypcja dla <b>${productName}</b> została odnowiona.</p>
              <p>Pobrano kwotę: <b>${(amount / 100).toFixed(2)} ${currency}</b>.</p>
              <p>Wkrótce się do Ciebie odezwiemy 💪</p>
            `;
            adminHtml = `
              <p>Subskrypcja użytkownika <a href="mailto:${customerEmail}">${customerEmail}</a> została odnowiona</p>
              <p>Produkt: <b>${productName}</b></p>
              <p>Kwota: <b>${(amount / 100).toFixed(2)} ${currency}</b></p>
              ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
            `;
            notes = "Automatyczne odnowienie subskrypcji";
            break;
          }
          case 'manual': {
            if(invoice.metadata?.action === 'UPDATE_SUBSCRIPTION') {
              userSubject = "Twoja subskrypcja została zaktualizowana 🎉";
              adminSubject = "Aktulizacja subskrypcji użytkownika";
              userHtml = `
                <p>Cześć!</p>
                <p>Twoja subskrypcja z <b>${oldProductName}</b> na <b>${newProductName}</b> została pomyslnie zaktualizowana.</p>
                <p>Pobrano kwotę: <b>${(amount / 100).toFixed(2)} ${currency}</b>.</p>
                <p>Wkrótce się do Ciebie odezwiemy 💪</p>
              `;
              adminHtml = `
                <p>Subskrypcja użytkownika <a href="mailto:${customerEmail}">${customerEmail}</a> została zaktualizowana z <b>${oldProductName}</b> na <b>${newProductName}</b></p>
                <p>Kwota: <b>${(amount / 100).toFixed(2)} ${currency}</b></p>
                ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
              `;
              notes = `Aktualizacja subskrypcji z ${oldProductName} na ${newProductName}`;
              break;
            }
          }
        }

        // 💾 Zapisz płatność
        await recordPayment({
          email: customerEmail,
          phone,
          userId,
          productName: billingReason === 'manual' && invoice.metadata?.action === 'UPDATE_SUBSCRIPTION' ? `Update subskrypcji z ${oldProductName} na ${newProductName}` : productName,
          paymentType: "subscription",
          amount,
          currency,
          source: "invoice.payment_succeeded",
          externalId: invoice.id,
          metadata: invoice.metadata ?? {},
          notes,
        });

        if (customerEmail) {
          await sendStatusEmail({ to: customerEmail, subject: userSubject, html: userHtml });
        }
        if (adminEmails.length > 0) {
          await sendStatusEmail({ to: adminEmails, subject: adminSubject, html: adminHtml });
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const billingReason = invoice.billing_reason;
        let productName = "Subskrypcja"; 
        let oldProductName = "Subskrypcja";
        let newProductName = "Subskrypcja";

        // try {
        //   if(billingReason === 'subscription_create' || billingReason === 'subscription_cycle') {
        //     const subscription = await stripe.subscriptions.retrieve(invoice.parent?.subscription_details?.subscription as string ?? '');
        //     const price = await stripe.prices.retrieve(subscription.items.data[0].plan.id ?? '');
        //     const product = await stripe.products.retrieve(price.product as string);
        //     productName = product.name;
        //   }
        //   if(billingReason === 'manual' && invoice.metadata?.action === 'UPDATE_SUBSCRIPTION'){
        //       const oldPrice = await stripe.prices.retrieve(invoice.metadata.oldPrice);
        //       const oldProduct = await stripe.products.retrieve(oldPrice.product as string);
        //       oldProductName = oldProduct.name

        //       const newPrice = await stripe.prices.retrieve(invoice.metadata.newPrice);
        //       const newProduct = await stripe.products.retrieve(newPrice.product as string);
        //       newProductName = newProduct.name
        //   }
          
        // } catch (error) {
        //   console.log('invoic details error: ', error);
        // }

        // let customerEmail: string | null = null;
        // try {
        //   const customer = await stripe.customers.retrieve(customerId);
        //   if (customer && typeof customer !== "string" && "email" in customer) {
        //     customerEmail = (customer.email as string) ?? null;
        //   }
        // } catch (err) {
        //   console.warn("⚠️ Nie udało się pobrać klienta Stripe:", err);
        // }

        // console.log('PRODUCT NAME: ', productName);




        // Pobierz usera z DB
        let phone: string | null = null;
        let userId: string | null = null;
        // if (customerEmail) {
        //   const user = await prisma.user.findUnique({
        //     where: { email: customerEmail },
        //     select: { id: true, phone: true },
        //   });
        //   phone = user?.phone ?? null;
        //   userId = user?.id ?? null;
        // }



        const amount = invoice.amount_paid;
        const currency = invoice.currency?.toUpperCase() ?? "PLN";

        // ✉️ Maile
        // const userSubject = billingReason === 'subscription_create' ? "Twoja subskrypcja została pomyślnie zakupiona 🎉" : "Twoja subskrypcja została automatycznie odnowiona 🎉";
        let userSubject = "Niepowodzenie płatności";
        let adminSubject = "Nowa Płatność";
        let userHtml = "";
        let adminHtml = "";
        let notes = ""
        console.log('**************')
        console.log('niepowodzenie płatności');
        console.log('BILLING reason ', billingReason);
        console.log('invoice metadata: ', invoice.metadata);
        console.log('*******************')

        // switch(billingReason){
        //   case 'subscription_create': {
        //     userSubject = "Twoja subskrypcja została pomyślnie zakupiona 🎉";
        //     adminSubject = "Nowa subskrypcja użytkownika";
        //     userHtml = `
        //       <p>Cześć!</p>
        //       <p>Twoja subskrypcja dla <b>${productName}</b> została utworzona.</p>
        //       <p>Pobrano kwotę: <b>${(amount / 100).toFixed(2)} ${currency}</b>.</p>
        //       <p>Wkrótce się do Ciebie odezwiemy 💪</p>
        //     `;
        //     adminHtml = `
        //       <p>Subskrypcja użytkownika <a href="mailto:${customerEmail}">${customerEmail}</a> została utworzona</p>
        //       <p>Produkt: <b>${productName}</b></p>
        //       <p>Kwota: <b>${(amount / 100).toFixed(2)} ${currency}</b></p>
        //       ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
        //     `;
        //     notes = "Zakup nowej subskrypcji";
        //     break;
        //   }
        //   case 'subscription_cycle': {
        //     userSubject = "Twoja subskrypcja została odnowiona 🎉";
        //     adminSubject = "Odnowienie subskrypcji użytkownika";
        //     userHtml = `
        //       <p>Cześć!</p>
        //       <p>Twoja subskrypcja dla <b>${productName}</b> została odnowiona.</p>
        //       <p>Pobrano kwotę: <b>${(amount / 100).toFixed(2)} ${currency}</b>.</p>
        //       <p>Wkrótce się do Ciebie odezwiemy 💪</p>
        //     `;
        //     adminHtml = `
        //       <p>Subskrypcja użytkownika <a href="mailto:${customerEmail}">${customerEmail}</a> została odnowiona</p>
        //       <p>Produkt: <b>${productName}</b></p>
        //       <p>Kwota: <b>${(amount / 100).toFixed(2)} ${currency}</b></p>
        //       ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
        //     `;
        //     notes = "Automatyczne odnowienie subskrypcji";
        //     break;
        //   }
        //   case 'manual': {
        //     if(invoice.metadata?.action === 'UPDATE_SUBSCRIPTION') {
        //       userSubject = "Twoja subskrypcja została zaktualizowana 🎉";
        //       adminSubject = "Aktulizacja subskrypcji użytkownika";
        //       userHtml = `
        //         <p>Cześć!</p>
        //         <p>Twoja subskrypcja z <b>${oldProductName}</b> na <b>${newProductName}</b> została pomyslnie zaktualizowana.</p>
        //         <p>Pobrano kwotę: <b>${(amount / 100).toFixed(2)} ${currency}</b>.</p>
        //         <p>Wkrótce się do Ciebie odezwiemy 💪</p>
        //       `;
        //       adminHtml = `
        //         <p>Subskrypcja użytkownika <a href="mailto:${customerEmail}">${customerEmail}</a> została zaktualizowana z <b>${oldProductName}</b> na <b>${newProductName}</b></p>
        //         <p>Kwota: <b>${(amount / 100).toFixed(2)} ${currency}</b></p>
        //         ${phone ? `<p>Telefon: <b><a href="tel:${phone}">${phone}</a></b></p>` : ""}
        //       `;
        //       notes = `Aktualizacja subskrypcji z ${oldProductName} na ${newProductName}`;
        //       break;
        //     }
        //   }
        // }

        // if (customerEmail) {
        //   await sendStatusEmail({ to: customerEmail, subject: userSubject, html: userHtml });
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