import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/authOptions";

const prisma = new PrismaClient();

function parseDateToUTCStart(dateStr?: string) {
  const d = dateStr ? dateStr : new Date().toISOString().split("T")[0];
  const [y, m, day] = d.split("-").map((v) => parseInt(v, 10));
  return new Date(Date.UTC(y, m - 1, day, 0, 0, 0, 0));
}

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
        orderBy: { date: "desc" },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });
  }

  return NextResponse.json(user.trainings);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
    }

    const rawBody = await req.json().catch(() => ({}));
    const { date, exercises: rawExercises, status, init } = rawBody as {
      date?: string;
      exercises?: any[] | undefined;
      status?: string;
      init?: boolean;
    };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

    const trainingDate = parseDateToUTCStart(date);

    // If init flag is used by client to create an empty IN_PROGRESS session
    if (init) {
      const created = await prisma.training.create({
        data: {
          date: trainingDate,
          userId: user.id,
          status: status === "IN_PROGRESS" ? "IN_PROGRESS" : "IN_PROGRESS",
        },
        include: { exercises: { include: { exercise: true } } },
      });
      return NextResponse.json(created, { status: 201 });
    }

    // Normalize exercises: only use when an array is provided
    const exercises = Array.isArray(rawExercises) ? rawExercises : undefined;

    const created = await prisma.training.create({
      data: {
        date: trainingDate,
        userId: user.id,
        status: status === "IN_PROGRESS" ? "IN_PROGRESS" : "DONE",
        exercises: exercises
          ? {
              create: exercises.map((ex: any) => ({
                exerciseId: ex.exerciseId,
                weight: ex.weight != null ? parseFloat(String(ex.weight)) : null,
                sets: Number.isFinite(Number(ex.sets)) ? parseInt(String(ex.sets), 10) : 0,
                reps: Number.isFinite(Number(ex.reps)) ? parseInt(String(ex.reps), 10) : 0,
              })),
            }
          : undefined,
      },
      include: { exercises: { include: { exercise: true } } },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/trainings error:", err);
    return NextResponse.json({ error: err?.message || "Błąd przy tworzeniu treningu." }, { status: 500 });
  }
}