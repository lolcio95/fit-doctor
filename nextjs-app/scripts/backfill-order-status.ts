require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Running backfill: setting notificationsEnabled=true for users missing that field");
  // Uwaga: dla Mongo przez Prisma zadziała $runCommandRaw lub updateMany z raw
  const res = await prisma.$runCommandRaw({
    update: "User",
    updates: [
      {
        q: { notificationsEnabled: { $exists: false } },
        u: { $set: { notificationsEnabled: true } },
        multi: true,
      },
    ],
  });
  console.log("Raw result:", res);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  // npx ts-node --transpile-only scripts/backfill-order-status.ts