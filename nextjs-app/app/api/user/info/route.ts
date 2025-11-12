import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { z } from "zod";
import {
  ACTIVITY_VALUES,
  GOAL_VALUES,
  WEIGHT_MIN,
  WEIGHT_MAX,
  HEIGHT_MIN,
  HEIGHT_MAX,
} from "@/app/consts/userInfo";

/**
 * Zod validation + weight upsert-by-day logic.
 * Now sex and birthDate are editable (PATCH will update them).
 * When a weight for the same day already exists, it will be updated (overwritten).
 */


const sexSchema = z.enum(["MALE", "FEMALE"], {
  required_error: "Podaj płeć",
  invalid_type_error: "Podaj płeć",
});

const birthDateStringSchema = z
  .string()
  .nonempty({ message: "Podaj datę urodzenia" })
  .refine((s) => !isNaN(Date.parse(s)), { message: "Nieprawidłowa data" })
  .refine((s) => new Date(s) <= new Date(), { message: "Data urodzenia nie może być z przyszłości." });

const positiveWeightSchema = z
  .number({ invalid_type_error: "Podaj wagę" })
  .min(WEIGHT_MIN, { message: "Waga jest za niska" })
  .max(WEIGHT_MAX, { message: "Waga jest za wysoka" });

const heightSchema = z
  .number({ invalid_type_error: "Podaj wzrost" })
  .int({ message: "Wzrost musi być liczbą całkowitą" })
  .min(HEIGHT_MIN, { message: "Wzrost jest za niski" })
  .max(HEIGHT_MAX, { message: "Wzrost jest za wysoki" });

const goalSchema = z.enum(GOAL_VALUES, {
  required_error: "Wybierz cel sylwetkowy",
  invalid_type_error: "Nieprawidłowy cel sylwetkowy",
});

const activitySchema = z.enum(ACTIVITY_VALUES, {
  required_error: "Podaj aktywność",
  invalid_type_error: "Podaj aktywność",
});

// POST - wymagane pola (pierwsze zapisanie profilu)
const postSchema = z.object({
  sex: sexSchema,
  birthDate: birthDateStringSchema,
  weight: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), positiveWeightSchema),
  height: z.preprocess((v) => (typeof v === "string" ? Number(v) : v), heightSchema),
  goal: goalSchema,
  activityLevel: activitySchema,
  // opcjonalne: weightRecordedAt (ISO)
  weightRecordedAt: z.string().optional(),
});

// PATCH - pola opcjonalne, ale walidowane jeśli przesłane
const patchSchema = postSchema.partial();

function formatZodErrors(err: z.ZodError) {
  return err.errors.map((e) => ({ path: e.path.join("."), message: e.message }));
}

async function resolveUserId(req: NextRequest): Promise<string | null> {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) {
      if (typeof (token as any).sub === "string") return (token as any).sub;
      if (typeof (token as any).userId === "string") return (token as any).userId;
    }
  } catch (err) {
    console.warn("getToken failed:", err);
  }

  try {
    const session = await getServerSession(authOptions);
    const id = (session as any)?.user?.id;
    if (typeof id === "string") return id;
  } catch (err) {
    console.warn("getServerSession failed:", err);
  }

  try {
    const hdr = req.headers.get("x-user-id");
    if (hdr) return hdr;
  } catch {}

  return null;
}

// helper: upsert weight by day (same userId and same YYYY-MM-DD)
async function upsertWeightByDay(userId: string, weight: number, recordedAt?: string) {
  const recorded = recordedAt ? new Date(recordedAt) : new Date();
  // normalize to UTC day bounds
  const start = new Date(Date.UTC(recorded.getUTCFullYear(), recorded.getUTCMonth(), recorded.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const existing = await prisma.weightEntry.findFirst({
    where: {
      userId,
      recordedAt: {
        gte: start,
        lt: end,
      },
    },
  });

  if (existing) {
    const updated = await prisma.weightEntry.update({
      where: { id: existing.id },
      data: {
        weight,
        recordedAt: recorded,
      },
      select: { weight: true, recordedAt: true },
    });
    return updated;
  }

  const created = await prisma.weightEntry.create({
    data: {
      weight,
      recordedAt: recorded,
      user: { connect: { id: userId } },
    },
    select: { weight: true, recordedAt: true },
  });

  return created;
}

export async function GET(req: NextRequest) {
  const userId = await resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "Brak user id (autoryzacja)" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        sex: true,
        birthDate: true,
        height: true,
        goal: true,
        activityLevel: true,
        weights: {
          orderBy: { recordedAt: "asc" },
          select: { weight: true, recordedAt: true },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "Użytkownik nieznaleziony" }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    console.error("GET /api/user/info error:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "Brak user id (autoryzacja)" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    const errors = formatZodErrors(parsed.error);
    return NextResponse.json({ error: "Walidacja nie powiodła się", details: errors }, { status: 400 });
  }

  const { sex, birthDate, weight, weightRecordedAt, height, goal, activityLevel } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: "Użytkownik nieznaleziony" }, { status: 404 });

    // Update profile fields (allow overwrite)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        sex,
        birthDate: new Date(birthDate),
        height: height ?? undefined,
        goal: goal ?? undefined,
        activityLevel: activityLevel ?? undefined,
      },
      select: { sex: true, birthDate: true, height: true, goal: true, activityLevel: true },
    });

    // upsert weight for the day
    const newWeightEntry = await upsertWeightByDay(userId, weight, weightRecordedAt);

    return NextResponse.json({ ...updatedUser, weightEntry: newWeightEntry });
  } catch (err) {
    console.error("POST /api/user/info error:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const userId = await resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "Brak user id (autoryzacja)" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const errors = formatZodErrors(parsed.error);
    return NextResponse.json({ error: "Walidacja nie powiodła się", details: errors }, { status: 400 });
  }

  const { sex, birthDate, weight, weightRecordedAt, height, goal, activityLevel } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: "Użytkownik nieznaleziony" }, { status: 404 });

    // Update profile fields (now editable)
    const updateData: any = {};
    if (sex !== undefined) updateData.sex = sex;
    if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
    if (height !== undefined) updateData.height = height;
    if (goal !== undefined) updateData.goal = goal;
    if (activityLevel !== undefined) updateData.activityLevel = activityLevel;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { sex: true, birthDate: true, height: true, goal: true, activityLevel: true },
    });

    // upsert weight for the day if provided
    let newWeightEntry = null;
    if (typeof weight === "number") {
      newWeightEntry = await upsertWeightByDay(userId, weight, weightRecordedAt);
    }

    return NextResponse.json({ ...updatedUser, weightEntry: newWeightEntry });
  } catch (err) {
    console.error("PATCH /api/user/info error:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}