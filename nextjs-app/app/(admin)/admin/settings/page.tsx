"use client";
import { NotificationsToggler } from "@/app/(user)/user/profile/components/NotificationsToggler";
import ProfilePasswordForm from "@/app/(user)/user/profile/components/ProfilePasswordForm";
import { Gift } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type FetchedUser = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  providers?: string[];
  hasPassword?: boolean;
  hasGoogleAccount?: boolean;
};

export default function AdminSettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingUserMeta, setLoadingUserMeta] = useState(false);
  const [userMeta, setUserMeta] = useState<FetchedUser | null>(null);
  const { data: sessionData } = useSession();

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

  if (loading) {
    return <div className="p-6">Ładowanie ustawień...</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Ustawienia</h1>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      <div className="rounded-2xl bg-background-card p-6 shadow-sm mb-4">
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
                Jesteś zalogowany przy pomocy zewnętrznego narzędzia. Zmiana
                hasła nie jest dostępna.
              </p>
            </div>
          ) : (
            // normal case: user can change password
            <ProfilePasswordForm />
          )}
        </div>
      </div>

      <NotificationsToggler
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
      />
    </div>
  );
}
