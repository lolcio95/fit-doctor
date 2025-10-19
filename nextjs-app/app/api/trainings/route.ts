import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/authOptions";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      trainings: {
        include: { exercises: { include: { exercise: true } } },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });
  }

  return NextResponse.json(user.trainings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const { date, exercises } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'Użytkownik nie znaleziony.' }, { status: 404 });
  }

  // Sprawdź, czy trening już istnieje dla wybranej daty (ignorujemy godzinę)
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await prisma.training.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: 'Masz już trening tego dnia!' }, { status: 400 });
  }

  const training = await prisma.training.create({
    data: {
      date: new Date(date),
      userId: user.id,
      exercises: {
        create: exercises.map((ex: any) => ({
          exerciseId: ex.exerciseId,
          weight: ex.weight ? parseFloat(ex.weight) : null,
          sets: parseInt(ex.sets),
          reps: parseInt(ex.reps),
        })),
      }
    }
  });

  return NextResponse.json(training, { status: 201 });
}