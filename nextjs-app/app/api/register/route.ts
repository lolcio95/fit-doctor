import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

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

    await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    return NextResponse.json({ message: 'Rejestracja udana!' }, { status: 201 });
  } catch (err) {
    console.error("registration error: ", err);
    return NextResponse.json({ error: 'Coś poszło nie tak.' }, { status: 500 });
  }
}