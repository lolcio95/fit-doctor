import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NextImage from "next/image";
import PaymentHistory from "../../../components/PaymentHistory";
import PaymentStatusSelect from "../../../components/PaymentStatusSelect";
import WeightChart from "@/app/(user)/user/info/components/WeightChart";
import BMI from "@/app/(user)/user/info/components/BMI";
import { differenceInYears, parseISO, isValid } from "date-fns";
import { GOAL_OPTIONS } from "@/app/consts/userInfo";
import { formatDisplayPhone } from "@/app/(user)/user/profile/components/PhoneInputForm/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import AdminFilesManager from "./components/AdminFilesManager";

type Props = {
  params: Promise<any> | undefined;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params!;

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser?.id) {
    return <div>Nie jesteś zalogowany</div>;
  }

  if (sessionUser?.role) {
    if (sessionUser.role !== "ADMIN") {
      return <div>Brak uprawnień</div>;
    }
  }

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
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
      },
    },
  });

  if (!payment) {
    return <div className="p-6">Zamówienie nie znalezione</div>;
  }

  const userData = await prisma.user.findFirst({
    where: { id: payment?.userId ?? "" },
  });

  const user = payment.user ?? null;

  // prepare data for client components (BMI, WeightChart)
  const weights =
    (user?.weights ?? []).map((w) => ({
      weight: w.weight,
      recordedAt: (w.recordedAt as Date).toISOString(),
    })) ?? [];

  const latestWeight =
    weights.length > 0 ? (weights[weights.length - 1].weight ?? null) : null;

  const getUserAge = () => {
    const b = user?.birthDate;
    if (!b) return "—";
    const d = typeof b === "string" ? parseISO(b) : (b as Date);
    if (!isValid(d)) return "—";
    return differenceInYears(new Date(), d);
  };

  const userGoal = user?.goal
    ? (GOAL_OPTIONS.find((o) => o.value === user.goal)?.label ?? "—")
    : "—";

  return (
    <div className="sm:p-6 w-full mx-auto">
      <nav className="mb-4">
        <Link
          href="/admin/orders"
          className="text-md text-blue-500 font-bold hover:underline"
        >
          ← Powrót do listy zamówień
        </Link>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: user card */}
        <aside className="col-span-2 xl:col-span-1 bg-background-card p-4 rounded-lg shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted-foreground/10">
              <NextImage
                src={user?.image ?? "/assets/user-img-placeholder.jpg"}
                alt={user?.name ?? user?.email ?? "User"}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold">{user?.name ?? "—"}</div>
              <div className="text-sm text-gray-300 break-words">
                {userData?.email ?? user?.email ?? "—"}
              </div>
              <div className="text-sm text-blue-400 break-words">
                {userData?.phone && formatDisplayPhone(userData.phone)}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {/* Przekazujemy tylko userId - PaymentHistory sam pobierze historię zamówień */}
            <PaymentHistory userId={user?.id ?? null} currentId={payment.id} />
          </div>
        </aside>

        {/* Right: payment details */}
        <div className="col-span-2 space-y-4">
          <div className="bg-background-card p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold truncate whitespace-normal break-words">
                  {payment.productName ?? "Zamówienie"}{" "}
                </h2>
                <div className="text-sm text-colors-tertiary mt-1">
                  {new Date(payment.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Kwota</div>
                  <div className="text-lg font-medium">
                    {((payment.amount ?? 0) / 100).toFixed(2)}{" "}
                    {payment.currency ?? ""}
                  </div>
                </div>

                <div className="w-40 sm:w-auto">
                  <PaymentStatusSelect
                    initialStatus={payment.orderStatus ?? "TO_PROCESS"}
                    paymentId={payment.id}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 lg:mt-7">
              <h3 className="text-md font-bold">Informacje o użytkowniku</h3>
              {/* <pre className="mt-2 text-xs bg-gray-50 p-2 rounded text-gray-700 overflow-auto max-h-48">
                {JSON.stringify(payment, null, 2)}
              </pre> */}
              {/* Jeśli mamy usera, pokaż szczegóły podobne do widoku użytkownika */}
              {user ? (
                <>
                  <div className="mt-6">
                    <div className="space-y-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
                        <div className="text-base font-medium">
                          {getUserAge()} lat
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-color-tertiary">
                          Wzrost (cm)
                        </div>
                        <div className="text-base font-medium">
                          {user.height ?? "—"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-color-tertiary">Cel</div>
                        <div className="text-base font-medium">{userGoal}</div>
                      </div>

                      <div>
                        <div className="text-xs text-color-tertiary">
                          Aktywność
                        </div>
                        <div className="text-base font-medium">
                          {user.activityLevel === "LOW" && "Mała"}
                          {user.activityLevel === "MEDIUM" && "Średnia"}
                          {user.activityLevel === "HIGH" && "Duża"}
                          {!user.activityLevel && "—"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-color-tertiary">
                          Aktualna waga
                        </div>
                        <div className="text-base font-medium">
                          {latestWeight ?? "—"} kg
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-color-tertiary">BMI</div>
                        <div className="mt-1">
                          {/* BMI to komponent kliencki */}
                          <BMI
                            height={user.height ?? null}
                            weight={latestWeight}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Historia wagi</h3>
                    <div className="bg-background-card w-full relative overflow-hidden">
                      <WeightChart weights={weights} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 text-sm text-gray-600">
                  Brak powiązanego użytkownika
                </div>
              )}
            </div>
          </div>

          <div className="bg-background-card px-4 py-7 rounded-lg shadow-sm">
            <div className="bg-background-card rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2">
                Pliki powiązane z zamówieniem
              </h3>
              <div>
                <AdminFilesManager paymentId={payment.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
