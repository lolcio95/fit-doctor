"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { List, Gift, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Purchase = {
  id: string;
  productName: string | null;
  paymentType: "one-time" | "subscription";
  amount: number;
  currency: string;
  receipt_url?: string | null;
  created: number;
};

export default function PaymentsPage() {
  const { data: sessionData } = useSession();
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planName, setPlanName] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const [loadingPurchases, setLoadingPurchases] = useState(false); // initial/refresh loading
  const [loadingMore, setLoadingMore] = useState(false); // loading for "load more" only
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchasesError, setPurchasesError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextStartingAfter, setNextStartingAfter] = useState<string | null>(
    null
  );
  const PAGE_LIMIT = 10;

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
      setPlanName(data.plan?.name || null);
      setPeriodEnd(Boolean(data.cancelAtPeriodEnd));
    } catch (err) {
      console.error("getUserPlan error", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  /**
   * fetchPurchases
   * - startingAfter: cursor for pagination (Stripe starting_after)
   * - append: when true, append to existing purchases instead of replacing them
   *
   * Behavior:
   * - when append === false -> setLoadingPurchases(true) and replace list when done
   * - when append === true -> setLoadingMore(true) and append results when done (do NOT clear existing list)
   */
  const fetchPurchases = async (
    email: string,
    startingAfter?: string | null,
    append = false
  ) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoadingPurchases(true);
      setPurchasesError(null);
    }

    // only clear server error for initial load; keep existing purchases visible during load-more
    if (!append) setPurchasesError(null);

    try {
      const params = new URLSearchParams();
      params.set("limit", String(PAGE_LIMIT));
      if (startingAfter) params.set("starting_after", startingAfter);
      const res = await fetch(`/api/payments/purchases?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Nie udało się pobrać zakupów.");
      }

      const fetched: Purchase[] = json.purchases || [];
      setHasMore(Boolean(json.hasMore));
      setNextStartingAfter(json.nextStartingAfter ?? null);

      // Append or replace depending on 'append' flag
      setPurchases((prev) => (append ? [...prev, ...fetched] : fetched));
    } catch (err: any) {
      console.error("fetchPurchases error", err);
      setPurchasesError(
        err?.message || "Wystąpił błąd przy pobieraniu zakupów."
      );
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoadingPurchases(false);
      }
    }
  };

  const handleLoadMore = async () => {
    if (!sessionData?.user?.email) return;
    if (!hasMore || !nextStartingAfter) return;
    // fetch and append; existing purchases remain visible while loadingMore is true
    await fetchPurchases(sessionData.user.email, nextStartingAfter, true);
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Czy na pewno chcesz anulować subskrypcję?")) return;
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
      if (sessionData?.user?.email) await getUserPlan(sessionData.user.email);
    } catch (err: any) {
      alert("❌ " + (err?.message || "Błąd"));
    }
  };

  useEffect(() => {
    if (sessionData?.user?.email) {
      getUserPlan(sessionData.user.email);
      // initial fetch -> replace purchases
      fetchPurchases(sessionData.user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData?.user?.email]);

  return (
    <section className="min-h-screen bg-background-primary py-16 px-0 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-color-secondary">
            Płatności i zakupy
          </h1>
          <p className="text-color-tertiary mt-2 max-w-2xl">
            Zarządzaj subskrypcją oraz przeglądaj jednorazowe zakupy (produkty).
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-background-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-color-primary/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-color-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-color-primary">
                  Subskrypcja
                </h3>
                <p className="text-sm text-color-tertiary mt-1">
                  Informacje o aktywnej subskrypcji.
                </p>
              </div>
            </div>

            <div className="mt-4">
              {loadingPlan ? (
                <p className="text-sm text-color-tertiary">
                  Ładowanie informacji o subskrypcji…
                </p>
              ) : planName ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-color-tertiary">Plan:</p>
                      <p className="font-medium">{planName}</p>
                    </div>
                    <div className="text-right">
                      {periodEnd ? (
                        <p className="text-sm text-color-tertiary">
                          Anulowano — dostęp do końca okresu
                        </p>
                      ) : (
                        <p className="text-sm text-color-tertiary">Aktywna</p>
                      )}
                    </div>
                  </div>

                  {!periodEnd ? (
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => (window.location.href = "/plans")}>
                        Zarządzaj
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleCancelSubscription}
                      >
                        Anuluj subskrypcję
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-color-tertiary mb-3">
                    Brak aktywnej subskrypcji.
                  </p>
                  <Button onClick={() => (window.location.href = "/plans")}>
                    Wybierz plan
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-background-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-color-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-color-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-color-primary">
                  Lista płatności
                </h3>
                <p className="text-sm text-color-tertiary mt-1">
                  Lista jednorazowych usług, oraz subskrypcji.
                </p>
              </div>
            </div>

            <div className="mt-4">
              {/* Show central loading only for the initial/empty state */}
              {loadingPurchases && purchases.length === 0 ? (
                <p className="text-sm text-color-tertiary">
                  Ładowanie płatności…
                </p>
              ) : purchasesError ? (
                <p className="text-sm text-red-600">{purchasesError}</p>
              ) : purchases.length === 0 ? (
                <p className="text-sm text-color-tertiary">Brak płatności.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {purchases.map((p) => (
                    <li
                      key={p.id}
                      className="border rounded p-3 bg-background-primary/5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {p.productName ?? "Produkt"}
                          </div>
                          <div className="text-sm text-color-tertiary">
                            {new Date(p.created * 1000).toLocaleString()}
                          </div>
                          <div className="text-sm text-color-tertiary">
                            Typ płatności:{" "}
                            {p.paymentType === "subscription"
                              ? "Subskrypcja"
                              : "Płatność jednorazowa"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {(p.amount / 100).toFixed(2)}{" "}
                            {p.currency?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* pagination / load more - only show button when hasMore true */}
              {hasMore && purchases.length > 0 && (
                <div className="mt-4 flex flex-col items-center">
                  <div className="mb-2 text-sm text-color-tertiary">
                    {loadingMore
                      ? "Ładowanie kolejnych produktów…"
                      : `Pokaż kolejne (${PAGE_LIMIT})`}
                  </div>
                  <Button onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? "Ładowanie..." : "Pokaż więcej"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-background-card p-6">
          <h4 className="text-md font-semibold text-color-primary">
            Pomoc i ustawienia
          </h4>
          <div className="mt-3 flex flex-col gap-3">
            <Link
              href="/help"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background-primary/10"
            >
              <XCircle className="w-5 h-5 text-color-primary" />
              <span className="text-sm">Kontakt / pomoc</span>
            </Link>
            <Link
              href="/user/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background-primary/10"
            >
              <List className="w-5 h-5 text-color-primary" />
              <span className="text-sm">Ustawienia konta</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
