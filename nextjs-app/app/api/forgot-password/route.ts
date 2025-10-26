import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/app/utils/mailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Jeśli konto istnieje, otrzymasz e‑mail z dalszymi instrukcjami.' }, { status: 200 });
    }

    const normalizedEmail = (email as string).toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ message: 'Jeśli konto istnieje, otrzymasz e‑mail z dalszymi instrukcjami.' }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await prisma.passwordResetToken.create({
      data: {
        identifier: normalizedEmail,
        tokenHash,
        expires,
        used: false,
      },
    });

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error('NEXT_PUBLIC_BASE_URL is not set in env');
    } else {
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
      const html = `
        <p>Cześć ${user.name || ''},</p>
        <p>Otrzymaliśmy prośbę o zresetowanie hasła. Kliknij poniższy link aby ustawić nowe hasło (ważne przez 1 godzinę):</p>
        <p><a href="${resetUrl}">Ustaw nowe hasło</a></p>
        <p>Jeżeli to nie Ty, zignoruj tę wiadomość.</p>
      `;
      try {
        await sendEmail({
          to: normalizedEmail,
          from: `Fit Doctor <${process.env.NEXT_PUBLIC_EMAIL_FROM}>`,
          subject: 'Reset hasła',
          html,
        });
      } catch (mailErr) {
        console.error('Mailer error (forgot-password):', mailErr);
      }
    }

    return NextResponse.json({ message: 'Jeśli konto istnieje, otrzymasz e‑mail z dalszymi instrukcjami.' }, { status: 200 });
  } catch (err) {
    console.error('forgot-password error:', err);
    return NextResponse.json({ error: 'Coś poszło nie tak.' }, { status: 500 });
  }
}