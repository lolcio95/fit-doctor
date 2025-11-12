import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";
import WeightChart from "./components/WeightChart";
import BMI from "./components/BMI";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { differenceInYears, parseISO, isValid } from "date-fns";
import { GOAL_OPTIONS } from "@/app/consts/userInfo";

type Props = {};

export default async function Page(_: Props) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;

  if (!userId) {
    return (
      <div className="p-6">
        <p>Nie jesteś zalogowany. Zaloguj się, aby zobaczyć profil.</p>
        <Link href="/api/auth/signin" className="text-blue-600 underline">
          Zaloguj
        </Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: String(userId) },
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

  if (!user) {
    return (
      <div className="p-6">
        <p>Użytkownik nie znaleziony.</p>
      </div>
    );
  }

  // prepare data for client components
  const weights = (user.weights ?? []).map((w) => ({
    weight: w.weight,
    recordedAt: w.recordedAt.toISOString(),
  }));

  const latestWeight =
    weights.length > 0 ? (weights[weights.length - 1].weight ?? null) : null;

  const getUserAge = () => {
    const b = user.birthDate;
    if (!b) return "—";
    const d = typeof b === "string" ? parseISO(b) : b;
    if (!isValid(d)) return "—";
    return differenceInYears(new Date(), d);
  };

  const userGoal =
    GOAL_OPTIONS.find((o) => o.value === user.goal)?.label ?? "—";

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-color-secondary mb-6">
          Informacje
        </h1>
        <p className="text-color-tertiary mb-8 max-w-2xl">
          Twoje podstawowe informacje.
        </p>
        <div className="bg-background-card rounded-lg shadow p-6">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <div className="text-xs text-color-tertiary">Płeć</div>
                <div className="text-base font-medium">
                  {user.sex
                    ? user.sex === "MALE"
                      ? "Mężczyzna"
                      : "Kobieta"
                    : "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-color-tertiary">Wiek</div>
                <div className="text-base font-medium">{getUserAge()} lat</div>
              </div>

              <div>
                <div className="text-xs text-color-tertiary">Wzrost (cm)</div>
                <div className="text-base font-medium">
                  {user.height ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-color-tertiary">Cel</div>
                <div className="text-base font-medium">{userGoal}</div>
              </div>

              <div>
                <div className="text-xs text-color-tertiary">Aktywność</div>
                <div className="text-base font-medium">
                  {user.activityLevel === "LOW" && "Mała"}
                  {user.activityLevel === "MEDIUM" && "Średnia"}
                  {user.activityLevel === "HIGH" && "Duża"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-color-tertiary">Aktualna waga</div>
                <div className="text-base font-medium">
                  {latestWeight ?? "—"} kg
                </div>
              </div>

              <div>
                <div className="text-xs text-color-tertiary">BMI</div>
                {/* BMI is a client component */}
                <BMI height={user.height ?? null} weight={latestWeight} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Historia wagi</h3>
            <div className="bg-background-card w-full relative overflow-hidden">
              {/* WeightChart is client component that renders chart.js */}
              <WeightChart weights={weights} />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <ButtonLink text="Edytuj" href="./info/edit" />
        </div>
      </div>
    </div>
  );
}
