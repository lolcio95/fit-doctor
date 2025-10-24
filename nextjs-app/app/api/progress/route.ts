import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/authOptions";

const prisma = new PrismaClient();

function toISODateString(d: Date) {
  return d.toISOString().split("T")[0];
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
    }

    const url = new URL(req.url);
    const exerciseId = url.searchParams.get("exerciseId");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Użytkownik nie znaleziony." }, { status: 404 });

    const trainings = await prisma.training.findMany({
      where: { userId: user.id },
      include: { exercises: { include: { exercise: true } } },
      orderBy: { date: "asc" }, // asc for time series
    });

    if (exerciseId) {
      // Build timeseries where each training date may contain multiple series for the exercise
      const series = trainings
        .map((t) => {
          const date = toISODateString(new Date(t.date));
          const entries = t.exercises
            .filter((te) => te.exerciseId === exerciseId)
            .map((te) => ({
              weight: te.weight ?? null,
              sets: te.sets,
              reps: te.reps,
              volume: te.weight != null ? (te.weight * te.sets * te.reps) : 0,
            }));
          if (!entries.length) return null;
          const weights = entries.map((e) => (e.weight == null ? null : e.weight)).filter((w) => w != null) as number[];
          const max = weights.length ? Math.max(...weights) : null;
          const avg = weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : null;
          const last = weights.length ? weights[weights.length - 1] : null;
          const totalVolume = entries.reduce((s, e) => s + (e.volume || 0), 0);
          return {
            date,
            weights: entries.map((e) => ({ weight: e.weight, sets: e.sets, reps: e.reps, volume: e.volume })),
            max,
            avg,
            last,
            volume: totalVolume,
          };
        })
        .filter(Boolean);
      return NextResponse.json({ series });
    }

    // summary (unchanged)...
    const map = new Map<string, { id: string; name: string; entries: any[] }>();
    for (const t of trainings) {
      const date = toISODateString(new Date(t.date));
      for (const te of t.exercises) {
        const ex = te.exercise;
        if (!ex) continue;
        const existing = map.get(ex.id) ?? { id: ex.id, name: ex.name, entries: [] as any[] };
        existing.entries.push({
          date,
          weight: te.weight,
          sets: te.sets,
          reps: te.reps,
        });
        map.set(ex.id, existing);
      }
    }

    const result = Array.from(map.values()).map((v) => ({
      id: v.id,
      name: v.name,
      entriesCount: v.entries.length,
      lastEntry: v.entries[v.entries.length - 1] ?? null, // trainings asc -> last is latest
      recent: v.entries.slice(-10).reverse(),
    }));

    result.sort((a, b) => a.name.localeCompare(b.name, "pl"));
    return NextResponse.json({ items: result });
  } catch (err: any) {
    console.error("GET /api/progress error:", err);
    return NextResponse.json({ error: err?.message || "Błąd serwera." }, { status: 500 });
  }
}