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
  if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

  const training = await prisma.training.findUnique({
    where: { id },
    include: { exercises: { include: { exercise: true } } },
  });

  if (!training || training.userId !== user.id) {
    return NextResponse.json({ error: "Nie znaleziono treningu lub brak uprawnień." }, { status: 404 });
  }

  return NextResponse.json(training);
}

export async function PATCH(req: NextRequest, ctx: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const params = ctx?.params;
  const { id } = { id: params?.id ?? new URL(req.url).pathname.split("/").pop() };
  const body = await req.json();
  const { date, exercises } = body as { date?: string; exercises?: any[] };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

  const training = await prisma.training.findUnique({ where: { id } });
  if (!training || training.userId !== user.id) {
    return NextResponse.json({ error: "Nie znaleziono treningu lub brak uprawnień." }, { status: 404 });
  }

  // update date if provided
  if (date) {
    await prisma.training.update({
      where: { id },
      data: { date: new Date(date) },
    });
  }

  // Replace exercises if provided: delete existing training exercises and create new ones
  if (Array.isArray(exercises)) {
    // delete existing
    await prisma.trainingExercise.deleteMany({ where: { trainingId: id } });

    // create new (loop to ensure compatibility)
    await Promise.all(
      exercises.map((ex) =>
        prisma.trainingExercise.create({
          data: {
            trainingId: id,
            exerciseId: ex.exerciseId,
            weight: ex.weight ? parseFloat(String(ex.weight)) : null,
            sets: parseInt(String(ex.sets), 10),
            reps: parseInt(String(ex.reps), 10),
          },
        })
      )
    );
  }

  const updated = await prisma.training.findUnique({
    where: { id },
    include: { exercises: { include: { exercise: true } } },
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

  // upewnij się, że użytkownik jest właścicielem treningu
  const training = await prisma.training.findUnique({ where: { id } });
  if (!training || training.userId !== user.id) {
    return NextResponse.json({ error: "Nie znaleziono treningu lub brak uprawnień." }, { status: 404 });
  }

  try {
    // najpierw usuń powiązane TrainingExercise, potem usuń sam Training
    await prisma.trainingExercise.deleteMany({ where: { trainingId: id } });
    await prisma.training.delete({ where: { id } });
    return NextResponse.json({ message: "Usunięto trening." });
  } catch (err) {
    console.error("Error deleting training:", err);
    return NextResponse.json({ error: "Błąd przy usuwaniu treningu." }, { status: 500 });
  }
}