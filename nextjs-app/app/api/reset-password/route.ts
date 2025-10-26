import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Brakuje tokenu lub hasła.' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Hasło musi mieć przynajmniej 8 znaków.' }, { status: 400 });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        used: false,
        expires: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Token jest nieprawidłowy lub wygasł.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: resetRecord.identifier } });
    if (!user) {
      await prisma.passwordResetToken.update({ where: { id: resetRecord.id }, data: { used: true } });
      return NextResponse.json({ error: 'Nie znaleziono konta.' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    });

    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    return NextResponse.json({ message: 'Hasło zostało zresetowane. Zaloguj się ponownie.' }, { status: 200 });
  } catch (err) {
    console.error('reset-password error:', err);
    return NextResponse.json({ error: 'Coś poszło nie tak.' }, { status: 500 });
  }
}