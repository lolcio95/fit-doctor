import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/authOptions";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const id = params?.id ?? new URL(req.url).pathname.split("/").pop();
  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!exercise) {
    return NextResponse.json({ error: "Ćwiczenie nie znalezione." }, { status: 404 });
  }

  return NextResponse.json(exercise);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  // safe id extraction (avoids Next.js "params should be awaited" issues)
  const id = params?.id ?? new URL(req.url).pathname.split("/").pop();

  // verify user
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

  // verify exercise exists and belongs to user
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise || exercise.userId !== user.id) {
    return NextResponse.json({ error: "Nie znaleziono ćwiczenia lub brak uprawnień." }, { status: 404 });
  }

  try {
    // 1) Remove all TrainingExercise relations that reference this exercise in trainings belonging to this user
    //    (we scope to trainings owned by user to be safe)
    const deletedRelations = await prisma.trainingExercise.deleteMany({
      where: {
        exerciseId: id,
        training: {
          userId: user.id,
        },
      },
    });

    // 2) Delete the exercise itself
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