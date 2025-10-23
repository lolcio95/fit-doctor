import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Brak tokenu.' }, { status: 400 });
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expires <= new Date()) {
      return NextResponse.json({ error: 'Token jest nieprawidłowy lub wygasł.' }, { status: 400 });
    }

    if (!record.identifier) {
      return NextResponse.json({ error: 'Nie można odnaleźć powiązanego adresu email.' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.deleteMany({
      where: {
        OR: [{ token }, { identifier: record.identifier }],
      },
    });

    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${base.replace(/\/$/, '')}/login?verified=1`;
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('verify error:', err);
    return NextResponse.json({ error: 'Coś poszło nie tak.' }, { status: 500 });
  }
}