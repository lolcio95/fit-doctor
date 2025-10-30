import {prisma} from "@/lib/prisma"

export const recordPayment = async ({
  email,
  phone,
  userId,
  productName,
  paymentType,
  amount,
  currency,
  source,
  externalId,
  metadata,
  notes,
}: {
  email?: string | null;
  phone?: string | null;
  userId?: string | null;
  productName?: string | null;
  paymentType: string;
  amount?: number | null;
  currency?: string | null;
  source?: string | null;
  externalId?: string | null;
  metadata?: Record<string, any> | null;
  notes?: string | null;
}) => {
    console.log("📘 Próba zapisania płatności:", {
    email,
    productName,
    amount,
    currency,
    externalId,
  });
  try {
    let dbUser = null;
    if (email) {
      dbUser = await prisma.user.findUnique({ where: { email } });
    }

    const existing = externalId
      ? await prisma.payment.findUnique({ where: { externalId } })
      : null;

    if (existing) {
      console.log(`ℹ️ Płatność ${externalId} już istnieje, pomijam zapis.`);
      return existing;
    }

    const payment = await prisma.payment.create({
      data: {
        email: email ?? null,
        phone: phone ?? null,
        userId: dbUser?.id ?? userId ?? null,
        productName,
        paymentType,
        amount: amount ?? null,
        currency: currency ?? null,
        source,
        externalId: externalId ?? undefined,
        metadata: metadata ?? undefined,
        processedAt: new Date(),
        notes,
      },
    });

    console.log(`✅ Zapisano płatność: ${paymentType} (${externalId})`);
    return payment;
  } catch (err) {
    console.error("❌ Błąd przy zapisie płatności:", err);
  }
}