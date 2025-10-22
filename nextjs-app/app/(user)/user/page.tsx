"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { data: sessionData } = useSession();
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionPlanName, setSubscriptionPlanName] = useState<
    string | null
  >(null);
  const [currentPlanName, setCurrentPlanName] = useState<string | null>(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUserPlan = async (email: string) => {
    setLoading(true);
    const res = await fetch("/api/plans/user-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    setSubscriptionId(data.subscriptionId || null);
    setCurrentPlanName(data.plan?.name || null);
    setSubscriptionPlanName(data.plan?.name || null);
    setCurrentPeriodEnd(data.cancelAtPeriodEnd);
    setLoading(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Czy na pewno chcesz anulować subskrypcję?")) return;

    setLoading(true);

    try {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Nie udało się anulować subskrypcji.");

      alert(
        "✅ Subskrypcja została anulowana. Nadal masz dostęp do końca okresu rozliczeniowego."
      );
      window.location.reload();
    } catch (err: any) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionData?.user?.email) {
      getUserPlan(sessionData.user.email);
    }
  }, [sessionData?.user?.email]);
  return (
    <section>
      <h1>Dashboard użytkownika</h1>
      <p>
        Witaj w swoim panelu! Tutaj będziesz mógł dodawać treningi, ćwiczenia,
        monitorować progres itd.
      </p>
      <p>Moje subskrypcje:</p>
      {subscriptionPlanName ? (
        <div>
          <p>Obecny plan: {currentPlanName}</p>
          {currentPeriodEnd ? (
            <p>
              Subskrypcja została anulowana. Nadal masz dostęp do końca okresu
              rozliczeniowego.
            </p>
          ) : (
            <div>
              {" "}
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Przetwarzanie..." : "Anuluj subskrypcję"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Brak aktywnej subskrypcji.</p>
      )}
    </section>
  );
}
