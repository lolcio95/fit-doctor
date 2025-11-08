require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Using DATABASE_URL:", !!process.env.DATABASE_URL);

  // Bez sprawdzania count — wykonujemy update i logujemy wynik raw
  const res = await prisma.$runCommandRaw({
    update: "Payment",
    updates: [
      {
        q: { orderStatus: { $exists: false } },
        u: { $set: { orderStatus: "TO_PROCESS" } },
        multi: true,
      },
    ],
  });

  console.log("Raw update result:", JSON.stringify(res, null, 2));

  // Różne wersje Mongo/Prisma mogą zwracać różne pola, spróbujemy kilka:
  const modifiedCount =
    res.modifiedCount ?? res.nModified ?? res.n ?? res.updatedExisting ?? null;
  console.log("Modified count (inferred):", modifiedCount);

  // Pobierz 1 przykładowy dokument z ustawionym orderStatus, żeby potwierdzić
  const sample = await prisma.payment.findFirst({
    where: { orderStatus: "TO_PROCESS" },
    select: { id: true, externalId: true, orderStatus: true },
  });
  console.log("Sample doc with orderStatus TO_PROCESS:", sample);

  // Dla pewności policz ile teraz ma orderStatus TO_PROCESS (opcjonalne)
  const countAfter = await prisma.payment.count({
    where: { orderStatus: "TO_PROCESS" },
  });
  console.log("Count with orderStatus TO_PROCESS:", countAfter);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  // npx ts-node --transpile-only scripts/backfill-order-status.ts