import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/app/utils/mailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Wszystkie pola są wymagane.' }, { status: 400 });
    }

    const normalizedName = name.toLowerCase().trim();
    const normalizedEmail = email.toLowerCase().trim();

    const userNameExists = await prisma.user.findFirst({
      where: { name: normalizedName },
    });
    if (userNameExists?.name?.toLowerCase() === normalizedName) {
      return NextResponse.json(
        { error: 'Użytkownik o tej nazwie już istnieje.' },
        { status: 400 }
      );
    }

    const userEmailExists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (userEmailExists) {
      return NextResponse.json(
        { error: 'Użytkownik o tym emailu już istnieje.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email: normalizedEmail, password: hashedPassword }
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: verificationToken,
        expires: expires,
      },
    });

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('NEXT_PUBLIC_BASE_URL is not set in env');
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')}/api/verify?token=${encodeURIComponent(verificationToken)}`;

    const html = `
      <p>Cześć ${name || ''},</p>
      <p>Dziękujemy za rejestrację. Kliknij poniższy link aby zweryfikować swoje konto:</p>
      <p><a href="${verificationUrl}">Weryfikuj konto</a></p>
      <p>Link wygasa po 24 godzinach.</p>
      <hr/>
      <p>Jeśli to nie Ty rejestrowałeś konto, zignoruj tę wiadomość.</p>
    `;

    try {
      await sendEmail({to: normalizedEmail, from: `Fit Doctor <${process.env.NEXT_PUBLIC_EMAIL_FROM}>`, subject: 'Rejestracja konta', html});
    } catch (mailErr) {
      console.error('Mailer error:', mailErr);
      // delete user if e-mail not send
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json({ error: 'Rejestracja zakończona, ale nie udało się wysłać maila weryfikacyjnego.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Rejestracja udana! Sprawdź swój e‑mail, aby potwierdzić konto.' }, { status: 201 });
  } catch (err) {
    console.error("registration error: ", err);
    return NextResponse.json({ error: 'Coś poszło nie tak.' }, { status: 500 });
  }
}