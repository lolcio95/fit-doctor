import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/app/utils/mailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // frontend może wysyłać pole `email` które może być faktycznym emailem lub nazwą użytkownika
    const rawIdentifier = body?.email ?? body?.identifier ?? body?.username;
    if (!rawIdentifier) {
      return NextResponse.json({ error: 'Email lub nazwa użytkownika jest wymagana.' }, { status: 400 });
    }

    const raw = String(rawIdentifier).trim();
    const looksLikeEmail = raw.includes('@');

    let user = null;

    if (looksLikeEmail) {
      // traktujemy to jak email (normalizuj do lowercase)
      const normalizedRawEmail = raw.toLowerCase();
      user = await prisma.user.findUnique({
        where: { email: normalizedRawEmail },
      });
    } else {
      // traktujemy to jak nazwa użytkownika -> najpierw szukamy po name
      // name w schema ma unique, więc findUnique jest właściwy, ale używamy findFirst by być bezpiecznym
      user = await prisma.user.findFirst({
        where: { name: raw },
      });

      // jeżeli nie znaleziono po name, spróbuj znaleźć po email (na wypadek, gdy użytkownik podał email bez @)
      if (!user) {
        const maybeEmail = raw.toLowerCase();
        user = await prisma.user.findUnique({
          where: { email: maybeEmail },
        });
      }
    }

    // Nie ujawniamy czy konto istnieje — zwracamy uniwersalny komunikat,
    // ale jeśli użytkownik nie istnieje to po prostu zakończymy z komunikatem 200.
    if (!user) {
      return NextResponse.json(
        { message: 'Jeśli istnieje konto powiązane z tym adresem e‑mail, wysłaliśmy link weryfikacyjny.' },
        { status: 200 }
      );
    }

    // Sprawdź, czy konto już zweryfikowane
    if ((user as any).emailVerified) {
      return NextResponse.json({ error: 'Konto jest już zweryfikowane.' }, { status: 400 });
    }

    // upewnij się, że mamy email z bazy do wysyłki
    const userEmail = user.email;
    if (!userEmail) {
      // jeśli konto istnieje ale nie ma emaila — zwracamy neutralny komunikat
      return NextResponse.json(
        { message: 'Jeśli istnieje konto powiązane z tym adresem e‑mail, wysłaliśmy link weryfikacyjny.' },
        { status: 200 }
      );
    }

    // utwórz nowy token i datę wygaśnięcia
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const normalizedEmail = userEmail.toLowerCase().trim();

    // Jeżeli istnieje już token dla tego identifiera, PODMIEŃ go (update).
    // W przeciwnym razie stwórz nowy wpis.
    const existing = await prisma.verificationToken.findFirst({
      where: { identifier: normalizedEmail },
      orderBy: { expires: 'desc' },
    });

    if (existing) {
      await prisma.verificationToken.update({
        where: { id: existing.id },
        data: { token: verificationToken, expires },
      });
    } else {
      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: verificationToken,
          expires,
        },
      });
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('NEXT_PUBLIC_BASE_URL is not set in env');
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')}/api/verify?token=${encodeURIComponent(
      verificationToken
    )}`;

    const html = `
      <p>Cześć ${user.name || ''},</p>
      <p>Wysłaliśmy nowy link weryfikacyjny. Kliknij poniżej, aby potwierdzić swoje konto:</p>
      <p><a href="${verificationUrl}">Weryfikuj konto</a></p>
      <p>Link wygasa po 24 godzinach.</p>
      <hr/>
      <p>Jeśli to nie Ty rejestrowałeś konto, zignoruj tę wiadomość.</p>
    `;

    try {
      await sendEmail({
        to: normalizedEmail,
        from: `Fit Doctor <${process.env.NEXT_PUBLIC_EMAIL_FROM || ''}>`,
        subject: 'Link weryfikacyjny — ponowne wysłanie',
        html,
      });
    } catch (mailErr) {
      console.error('Mailer error (resend verification):', mailErr);
      return NextResponse.json(
        { error: 'Nie udało się wysłać wiadomości weryfikacyjnej. Spróbuj ponownie później.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Wysłaliśmy link weryfikacyjny. Sprawdź swoją skrzynkę e‑mail.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('resend-verification error:', err);
    return NextResponse.json({ error: 'Coś poszło nie tak.' }, { status: 500 });
  }
}