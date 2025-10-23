import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/app/utils/mailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Wszystkie pola są wymagane.' }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json({ error: 'Użytkownik o tym emailu już istnieje.' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: expires,
      },
    });

    try {
      await sendVerificationEmail(email, verificationToken, name || '');
    } catch (mailErr) {
      console.error('Mailer error:', mailErr);
      // delete use if e-mail not send
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json({ error: 'Rejestracja zakończona, ale nie udało się wysłać maila weryfikacyjnego.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Rejestracja udana! Sprawdź swój e‑mail, aby potwierdzić konto.' }, { status: 201 });
  } catch (err) {
    console.error("registration error: ", err);
    return NextResponse.json({ error: 'Coś poszło nie tak.' }, { status: 500 });
  }
}