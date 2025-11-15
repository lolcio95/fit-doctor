"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Gift, XCircle, Phone, Settings } from "lucide-react";
import ProfilePasswordForm from "./components/ProfilePasswordForm";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PhoneInputForm } from "./components/PhoneInputForm";
import { formatDisplayPhone } from "./components/PhoneInputForm/utils";
import { Button } from "@/app/components/atoms/Button";
import { NotificationsToggler } from "./components/NotificationsToggler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormValues as PhoneFormData,
  schema as phoneSchema,
} from "./components/PhoneInputForm/consts";

type FetchedUser = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  providers?: string[];
  hasPassword?: boolean;
  hasGoogleAccount?: boolean;
};

export default function ProfilePage() {
  const { data: sessionData } = useSession();
  const [userMeta, setUserMeta] = useState<FetchedUser | null>(null);
  const [loadingUserMeta, setLoadingUserMeta] = useState(false);

  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionPlanName, setSubscriptionPlanName] = useState<
    string | null
  >(null);
  const [currentPlanName, setCurrentPlanName] = useState<string | null>(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserPlan = async (email: string) => {
    setLoadingPlan(true);
    try {
      const res = await fetch("/api/plans/user-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubscriptionId(data.subscriptionId || null);
      setCurrentPlanName(data.plan?.name || null);
      setSubscriptionPlanName(data.plan?.name || null);
      setCurrentPeriodEnd(Boolean(data.cancelAtPeriodEnd));
    } catch (err) {
      console.error("getUserPlan error", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  useEffect(() => {
    if (sessionData?.user?.email) {
      getUserPlan(sessionData.user.email);
    }
  }, [sessionData?.user?.email]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!sessionData?.user?.email) return;
      setLoadingUserMeta(true);
      try {
        const res = await fetch("/api/user/me");
        if (!res.ok) return;
        const json = await res.json();

        setUserMeta(json || null);
        // initialize phone display format
      } catch (err) {
        console.error("fetch /api/user/me error", err);
      } finally {
        setLoadingUserMeta(false);
      }
    };
    fetchUser();
  }, [sessionData?.user?.email]);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const json = await res.json();
      setNotificationsEnabled(Boolean(json.notificationsEnabled));
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Błąd pobierania ustawień");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (userMeta?.phone) {
      setValue(
        "phone",
        userMeta?.phone ? formatDisplayPhone(userMeta.phone) : "",
        { shouldValidate: true }
      );
    }
  }, [userMeta?.phone, setValue]);

  const onSubmit = async (data: { phone: string }) => {
    setSavingPhone(true);
    setPhoneError(null);
    try {
      const res = await fetch("/api/user/change-phone-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });
      const json = await res.json();

      if (!res.ok) {
        setPhoneError(json?.error || "Błąd podczas zapisywania numeru");
      } else {
        setUserMeta((prev) => ({ ...(prev ?? {}), phone: json?.user?.phone }));
      }
    } catch (err) {
      console.error(err);
      setPhoneError("Błąd podczas zapisywania numeru");
    } finally {
      setSavingPhone(false);
    }
  };

  return (
    <section className="bg-background-primary py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        <main className="col-span-1 lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-color-secondary">
              Ustawienia konta
            </h1>
            <p className="text-color-tertiary mt-2 max-w-2xl">
              Zarządzaj informacjami o koncie, subskrypcji i bezpieczeństwie.
            </p>
          </div>
          <NotificationsToggler
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="rounded-2xl bg-background-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-color-primary/10 flex items-center justify-center">
                  {/* simple icon */}
                  <Gift className="w-6 h-6 text-color-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-color-primary">
                    Subskrypcja
                  </h3>
                  <p className="text-sm text-color-tertiary mt-1">
                    Zarządzaj swoim planem i płatnościami.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {loadingPlan ? (
                  <p className="text-sm text-color-tertiary">
                    Ładowanie informacji o subskrypcji…
                  </p>
                ) : subscriptionPlanName ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-color-tertiary">Plan:</p>
                        <p className="font-medium">{currentPlanName}</p>
                      </div>
                      <div className="text-right">
                        {currentPeriodEnd ? (
                          <p className="text-sm text-color-tertiary">
                            Anulowano — dostęp do końca okresu
                          </p>
                        ) : (
                          <p className="text-sm text-color-tertiary">Aktywna</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-color-tertiary mb-3">
                      Brak aktywnej subskrypcji.
                    </p>
                    <ButtonLink href="/plans" text="Wybierz plan" />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm text-color-tertiary">
                  Przejdź do strony subskrypcji, aby kupić, zmienić lub anulować
                  plan.
                </p>
                <div className="mt-3 flex gap-2">
                  <ButtonLink
                    href="/user/payments"
                    text="Zarządzaj subskrypcją"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-color-primary/10 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-color-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-color-primary">
                    Bezpieczeństwo
                  </h3>
                  <p className="text-sm text-color-tertiary mt-1">
                    Zmień hasło swojego konta.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {loadingUserMeta ? (
                  <p className="text-sm text-color-tertiary">
                    Ładowanie informacji o koncie…
                  </p>
                ) : userMeta?.hasGoogleAccount ? (
                  <div className="rounded-md border border-yellow-600/20 bg-yellow-600/5 p-4">
                    <p className="text-sm text-color-tertiary">
                      Jesteś zalogowany przy pomocy zewnętrznego narzędzia.
                      Zmiana hasła nie jest dostępna.
                    </p>
                  </div>
                ) : (
                  // normal case: user can change password
                  <ProfilePasswordForm />
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-background-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-color-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-color-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-color-primary">
                    Telefon
                  </h3>
                  <p className="text-sm text-color-tertiary mt-1">
                    Zmień numer swojego telefonu.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {loadingUserMeta ? (
                  <p className="text-sm text-color-tertiary">Ładowanie…</p>
                ) : (
                  <div className="space-y-3">
                    <PhoneInputForm
                      control={control}
                      errors={errors}
                      disabled={savingPhone}
                    />

                    {phoneError && (
                      <div className="rounded-md bg-red-100 p-2 text-sm text-red-700">
                        {phoneError}
                      </div>
                    )}
                    <div>
                      <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={savingPhone}
                        text={savingPhone ? "Zapisuję..." : "Zapisz numer"}
                      />
                      <Button
                        text="Przywróć"
                        variant="ghost"
                        type="button"
                        className="text-sm text-color-primary underline"
                        onClick={() =>
                          setValue(
                            "phone",
                            userMeta?.phone
                              ? formatDisplayPhone(userMeta.phone)
                              : ""
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-background-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-color-primary/10 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-color-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-color-primary">
                    Pomoc
                  </h3>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background-primary/10"
                >
                  <XCircle className="w-5 h-5 text-color-primary" />
                  <span className="text-sm">Kontakt / pomoc</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
