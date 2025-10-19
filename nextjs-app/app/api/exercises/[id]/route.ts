import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/authOptions";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, ctx: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const params = ctx?.params;
  const id = params?.id ?? new URL(req.url).pathname.split("/").pop();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "Użytkownik nieznaleziony." }, { status: 404 });
  }

  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!exercise) {
    return NextResponse.json({ error: "Ćwiczenie nie znalezione." }, { status: 404 });
  }

  // Count how many trainingExercise relations reference this exercise for trainings that belong to this user
  const usedCount = await prisma.trainingExercise.count({
    where: {
      exerciseId: id,
      training: {
        userId: user.id,
      },
    },
  });

  return NextResponse.json({ ...exercise, usedCount });
}

export async function PATCH(req: NextRequest, ctx: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const params = ctx?.params;
  const id = params?.id ?? new URL(req.url).pathname.split("/").pop();
  const body = await req.json();
  const { name, description } = body as { name?: string; description?: string };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise || exercise.userId !== user.id) {
    return NextResponse.json({ error: "Nie znaleziono ćwiczenia lub brak uprawnień." }, { status: 404 });
  }

  const updated = await prisma.exercise.update({
    where: { id },
    data: {
      name: name ?? exercise.name,
      description: description ?? exercise.description,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, ctx: any) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const params = ctx?.params;
  const id = params?.id ?? new URL(req.url).pathname.split("/").pop();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise || exercise.userId !== user.id) {
    return NextResponse.json({ error: "Nie znaleziono ćwiczenia lub brak uprawnień." }, { status: 404 });
  }

  try {
    // remove all TrainingExercise relations that reference this exercise in trainings belonging to this user
    const deletedRelations = await prisma.trainingExercise.deleteMany({
      where: {
        exerciseId: id,
        training: {
          userId: user.id,
        },
      },
    });

    // delete the exercise itself
    await prisma.exercise.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Usunięto ćwiczenie oraz powiązania z treningami.",
      removedTrainingExerciseCount: deletedRelations.count ?? 0,
    });
  } catch (err) {
    console.error("Error deleting exercise and relations:", err);
    return NextResponse.json({ error: "Błąd przy usuwaniu ćwiczenia." }, { status: 500 });
  }
}