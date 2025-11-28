"use client";

import React, { useState } from "react";
import NextImage from "next/image";
import { useSession, signOut } from "next-auth/react";
import imagePlaceholder from "@/public/assets/user-img-placeholder.jpg";
import Link from "next/link";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";

export default function DashboardPage() {
  const { data: sessionData } = useSession();
  const [userMeta, setUserMeta] = useState<{
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null>(null);

  // ... (reszta Twojego istniejącego kodu: plan, sidebar, etc.) ...

  // --- New: EDM patient form state ---
  const [patientName, setPatientName] = useState("");
  const [patientSurname, setPatientSurname] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPesel, setPatientPesel] = useState("");
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState<string | null>(null);
  const [patientSuccess, setPatientSuccess] = useState<any | null>(null);

  const submitCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError(null);
    setPatientSuccess(null);

    if (!patientName || !patientSurname) {
      setPatientError("Imię i nazwisko są wymagane");
      return;
    }

    setPatientLoading(true);
    try {
      const res = await fetch("/api/edm/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: patientName,
          surname: patientSurname,
          email: patientEmail,
          pesel: patientPesel,
        }),
      });

      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }

      if (!res.ok) {
        setPatientError(json?.error || JSON.stringify(json));
      } else {
        setPatientSuccess(json);
        setPatientName("");
        setPatientSurname("");
        setPatientEmail("");
        setPatientPesel("");
      }
    } catch (err: any) {
      console.error("create patient error", err);
      setPatientError(err?.message ?? "Błąd sieci");
    } finally {
      setPatientLoading(false);
    }
  };

  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

  // ... (twoje useEffecty pobierające userMeta, plan itp.) ...

  const avatarSrc = sessionData?.user?.image ?? undefined;

  return (
    <section className="bg-background-primary py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar (bez zmian) */}
        <aside className="col-span-1 bg-background-card rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-muted-foreground/10">
            <NextImage
              src={avatarSrc ?? imagePlaceholder}
              alt={userMeta?.name ?? sessionData?.user?.name ?? "Avatar"}
              width={112}
              height={112}
              className="object-cover w-full h-full"
              priority={false}
            />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-color-primary">
              {userMeta?.name ?? sessionData?.user?.name ?? "Użytkownik"}
            </h3>
            {userMeta?.email || sessionData?.user?.email ? (
              <p className="text-sm text-color-tertiary mt-1">
                {userMeta?.email ?? sessionData?.user?.email}
              </p>
            ) : null}
            {userMeta?.phone ? (
              <p className="text-sm text-color-tertiary mt-1">
                {userMeta.phone}
              </p>
            ) : null}
          </div>

          <div className="w-full mt-4">
            <nav className="flex flex-col gap-2 items-center">
              <Link
                href="/user/info"
                className="w-full max-w-[300px] block text-center xl:text-left px-4 py-2 rounded-md hover:bg-background-primary/10 transition-colors"
              >
                Informacje
              </Link>
              <Link
                href="/user/profile"
                className="w-full max-w-[300px] block text-center xl:text-left px-4 py-2 rounded-md hover:bg-background-primary/10 transition-colors"
              >
                Ustawienia konta
              </Link>
              <Link
                href="/user/payments"
                className="w-full max-w-[300px] block text-center xl:text-left px-4 py-2 rounded-md hover:bg-background-primary/10 transition-colors"
              >
                Płatności
              </Link>
              <button
                onClick={logout}
                className="w-full max-w-[300px] block text-center xl:text-left px-4 py-2 rounded-md hover:bg-background-primary/10 transition-colors"
              >
                Wyloguj
              </button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-1 lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-color-secondary">
              Twój panel
            </h1>
            <p className="text-color-tertiary mt-2 max-w-2xl">
              Witaj w swoim panelu! Tutaj możesz zarządzać ćwiczeniami,
              treningami i subskrypcją.
            </p>
          </div>

          {/* Quick cards (twoje istniejące) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... existing cards ... */}
          </div>

          {/* New: Create patient form */}
          <div className="mt-6 rounded-2xl bg-background-card p-6">
            <h3 className="text-lg font-semibold text-color-primary">
              Utwórz pacjenta w myDr EDM
            </h3>
            <p className="text-sm text-color-tertiary mt-1">
              Wypełnij przynajmniej imię i nazwisko. Email i PESEL opcjonalne.
            </p>

            <form
              onSubmit={submitCreatePatient}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl"
            >
              <input
                placeholder="Imię"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="px-3 py-2 rounded border bg-background-primary/20"
                required
              />
              <input
                placeholder="Nazwisko"
                value={patientSurname}
                onChange={(e) => setPatientSurname(e.target.value)}
                className="px-3 py-2 rounded border bg-background-primary/20"
                required
              />
              <input
                placeholder="Email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="px-3 py-2 rounded border bg-background-primary/20 md:col-span-2"
                type="email"
              />
              <input
                placeholder="PESEL"
                value={patientPesel}
                onChange={(e) => setPatientPesel(e.target.value)}
                className="px-3 py-2 rounded border bg-background-primary/20 md:col-span-2"
              />

              <div className="flex gap-2 md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={patientLoading}
                  className="px-4 py-2 rounded bg-color-primary text-black"
                >
                  {patientLoading ? "Tworzenie..." : "Utwórz pacjenta"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPatientName("");
                    setPatientSurname("");
                    setPatientEmail("");
                    setPatientPesel("");
                    setPatientError(null);
                    setPatientSuccess(null);
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Wyczyść
                </button>
              </div>
              {patientError && (
                <div className="text-sm text-red-600 md:col-span-2">
                  {patientError}
                </div>
              )}
              {patientSuccess && (
                <div className="text-sm text-green-600 md:col-span-2">
                  Pacjent utworzony. Odpowiedź API:{" "}
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(patientSuccess, null, 2)}
                  </pre>
                </div>
              )}
            </form>
          </div>

          {/* rest of your page ... */}
        </main>
      </div>
    </section>
  );
}
