import { sendEmail } from "@/app/utils/mailer";
import {prisma} from "@/lib/prisma"
import type { Role } from "@prisma/client";
  
  type SendStatusEmailParams = {
  to?: string | string[];
  toAdmins?: boolean;

  subject: string;
  html: string;
  from?: string;
};

export async function sendStatusEmail({
  to,
  toAdmins,
  subject,
  html,
  from,
}: SendStatusEmailParams): Promise<string[]> {
  try {
    let recipients: string[] = [];

    if (toAdmins) {
      // pobierz adminów, którzy mają notificationsEnabled === true i email != null
      const admins = await prisma.user.findMany({
        where: {
          role: "ADMIN" as Role,
          notificationsEnabled: true,
          email: { not: null },
        },
        select: { email: true },
      });

      recipients = admins
        .map((a) => a.email)
        .filter((e): e is string => Boolean(e))
        .filter((v, i, arr) => arr.indexOf(v) === i); // dedupe
    } else if (typeof to === "string") {
      // znajdź użytkownika po email i sprawdź ustawienie notificationsEnabled
      const user = await prisma.user.findUnique({
        where: { email: to },
        select: { email: true, notificationsEnabled: true },
      });

      if (!user) {
        console.info(`sendStatusEmail: user with email="${to}" not found — skipping send.`);
        return [];
      }

      if (user.email && user.notificationsEnabled === true) {
        recipients = [user.email];
      } else {
        console.info(
          `sendStatusEmail: user ${to} has notificationsEnabled !== true — skipping send.`
        );
        return [];
      }
    } else if (Array.isArray(to)) {
      // znajdź użytkowników o podanych emailach, ale tylko tych z notificationsEnabled === true
      const users = await prisma.user.findMany({
        where: {
          email: { in: to },
          notificationsEnabled: true,
          // email: { not: null },
        },
        select: { email: true },
      });

      recipients = users
        .map((u) => u.email)
        .filter((e): e is string => Boolean(e))
        .filter((v, i, arr) => arr.indexOf(v) === i); // dedupe
    }

    // jeśli brak odbiorców to nic nie robimy
    if (!recipients || recipients.length === 0) {
      console.info(
        `sendStatusEmail: brak odbiorców (toAdmins=${Boolean(
          toAdmins
        )}, to=${Array.isArray(to) ? JSON.stringify(to) : to}). Mail "${subject}" nie zostanie wysłany.`
      );
      return [];
    }

    const fromAddress =
      from ?? `Fit Doctor <${process.env.NEXT_PUBLIC_EMAIL_FROM ?? "no-reply@example.com"}>`;

    // Wywołanie twojego helpera do wysyłki maila - obsługuje string | string[]
    await sendEmail({
      to: recipients,
      from: fromAddress,
      subject,
      html,
    });

    console.info(
      `sendStatusEmail: wysłano mail "${subject}" do ${recipients.length} odbiorców`
    );
    return recipients;
  } catch (err: any) {
    console.error(`❌ Błąd wysyłania maila [${subject}]:`, err);
    return [];
  }
}