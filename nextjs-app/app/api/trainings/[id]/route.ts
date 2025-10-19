import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, TrainingStatus } from "@prisma/client";
import { authOptions } from "../../auth/authOptions";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, ctx: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
    }

    // params może być thenable/proxy — trzeba go awaitować
    const params = ctx?.params ? await ctx.params : undefined;
    const id = params?.id ?? new URL(req.url).pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Brak id." }, { status: 400 });

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
  } catch (err: any) {
    console.error("GET /api/trainings/[id] error:", err);
    return NextResponse.json({ error: err?.message || "Błąd serwera." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
    }

    const params = ctx?.params ? await ctx.params : undefined;
    const id = params?.id ?? new URL(req.url).pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Brak id." }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const { date, exercises, status: incomingStatus } = body as { date?: string; exercises?: any[]; status?: string };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

    const training = await prisma.training.findUnique({ where: { id } });
    if (!training || training.userId !== user.id) {
      return NextResponse.json({ error: "Nie znaleziono treningu lub brak uprawnień." }, { status: 404 });
    }

    // Server-side guard: don't allow reverting a DONE training back to IN_PROGRESS
    let statusToSet: TrainingStatus | undefined = undefined;
    if (typeof incomingStatus === "string") {
      if (incomingStatus === "DONE") {
        statusToSet = TrainingStatus.DONE;
      } else if (incomingStatus === "IN_PROGRESS") {
        if (training.status !== TrainingStatus.DONE) {
          statusToSet = TrainingStatus.IN_PROGRESS;
        } else {
          statusToSet = undefined;
        }
      }
    }

    // Update date if provided
    if (date) {
      await prisma.training.update({
        where: { id },
        data: { date: new Date(date) },
      });
    }

    // If exercises provided, replace them (deleteMany + create)
    if (Array.isArray(exercises)) {
      await prisma.trainingExercise.deleteMany({ where: { trainingId: id } });

      if (exercises.length) {
        await Promise.all(
          exercises.map((ex) =>
            prisma.trainingExercise.create({
              data: {
                trainingId: id,
                exerciseId: ex.exerciseId,
                weight: ex.weight != null ? parseFloat(String(ex.weight)) : null,
                sets: parseInt(String(ex.sets), 10),
                reps: parseInt(String(ex.reps), 10),
              },
            })
          )
        );
      }
    }

    // Update status if needed
    if (statusToSet) {
      await prisma.training.update({ where: { id }, data: { status: statusToSet } });
    }

    const updated = await prisma.training.findUnique({
      where: { id },
      include: { exercises: { include: { exercise: true } } },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH /api/trainings/[id] error:", err);
    return NextResponse.json({ error: err?.message || "Błąd serwera przy zapisie treningu." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
    }

    const params = ctx?.params ? await ctx.params : undefined;
    const id = params?.id ?? new URL(req.url).pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Brak id." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

    const training = await prisma.training.findUnique({ where: { id } });
    if (!training || training.userId !== user.id) {
      return NextResponse.json({ error: "Nie znaleziono treningu lub brak uprawnień." }, { status: 404 });
    }

    await prisma.trainingExercise.deleteMany({ where: { trainingId: id } });
    await prisma.training.delete({ where: { id } });

    return NextResponse.json({ message: "Usunięto trening." });
  } catch (err: any) {
    console.error("DELETE /api/trainings/[id] error:", err);
    return NextResponse.json({ error: err?.message || "Błąd serwera przy usuwaniu treningu." }, { status: 500 });
  }
}