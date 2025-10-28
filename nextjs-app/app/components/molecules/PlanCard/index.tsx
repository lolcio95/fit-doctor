"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Plans } from "@/sanity.types";
import { Button } from "@/app/components/atoms/Button";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type PlanItem = NonNullable<Plans["plans"]>[number];

export interface PlanCardProps {
  planData: PlanItem;
  planDataLoading?: boolean;
  currentPlanId?: string | null;
  currentPlanPrice?: number | null;
  currentSubscriptionId?: string | null;
  subscriptionItemId?: string | null;
}

export const PlanCard = ({
  planData,
  currentPlanId,
  currentPlanPrice,
  planDataLoading,
  currentSubscriptionId,
  subscriptionItemId,
}: PlanCardProps) => {
  const { status: sessionStatus, data: sessionData } = useSession();
  const router = useRouter();
  const [planId, setPlanId] = useState<string | null>(null);
  const {
    _key,
    highlighted,
    highlightedText,
    title,
    advantages,
    priceId,
    priceIdOneTime,
  } = planData;
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const isDataLoading =
    planDataLoading || loading || sessionStatus === "loading" || modalLoading;

  const fetchProductByPrice = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plans/product-by-price-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: sessionData?.user?.email }),
      });

      if (!res.ok) {
        console.error("fetchProductByPrice - bad response", await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();
      setPrice(data.product.price / 100);
      setPlanId(data.product.id);
    } catch (err) {
      console.error("fetchProductByPrice error:", err);
    } finally {
      setLoading(false);
    }
  }, [priceId, sessionData?.user?.email]);

  useEffect(() => {
    fetchProductByPrice();
  }, [fetchProductByPrice]);

  const openPaymentModal = () => {
    if (sessionStatus !== "authenticated") {
      router.push("/login");
      return;
    }
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (modalLoading) return;
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleSubscriptionPurchase = async () => {
    setModalError(null);
    setModalLoading(true);

    try {
      const res = await fetch("/api/subscriptions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: sessionData?.user?.email }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Błąd odpowiedzi z backendu (subscription):", text);
        setModalError("Błąd tworzenia sesji subskrypcji. Sprawdź konsolę.");
        setModalLoading(false);
        return;
      }

      const data = await res.json();
      if (!data.url) {
        setModalError("Brak URL do checkoutu w odpowiedzi.");
        setModalLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("❌ Checkout error (subscription):", err);
      setModalError("Coś poszło nie tak. Sprawdź konsolę.");
      setModalLoading(false);
    }
  };

  const handleOneTimePurchase = async () => {
    setModalError(null);
    setModalLoading(true);

    try {
      const res = await fetch("/api/payments/one-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: priceIdOneTime,
          email: sessionData?.user?.email,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Błąd odpowiedzi z backendu (one-time):", text);
        setModalError("Błąd tworzenia sesji płatności jednorazowej.");
        setModalLoading(false);
        return;
      }

      const data = await res.json();
      const redirectUrl = data.url ?? data.checkoutUrl;
      if (!redirectUrl) {
        console.error("Brak URL do checkoutu (one-time).", data);
        setModalError("Brak URL do checkoutu w odpowiedzi.");
        setModalLoading(false);
        return;
      }

      window.location.href = redirectUrl;
    } catch (err) {
      console.error("❌ One-time checkout error:", err);
      setModalError("Coś poszło nie tak. Sprawdź konsolę.");
      setModalLoading(false);
    }
  };

  const openConfirmModal = () => {
    setConfirmError(null);
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    if (confirmLoading) return;
    setIsConfirmOpen(false);
    setConfirmError(null);
  };

  const handleChangePlan = async () => {
    setConfirmError(null);
    setConfirmLoading(true);

    try {
      const res = await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: currentSubscriptionId,
          subscriptionItemId: subscriptionItemId,
          newPriceId: priceId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error || "Błąd aktualizacji planu";
        throw new Error(msg);
      }

      setConfirmLoading(false);
      setIsConfirmOpen(false);
      alert(
        `Zmieniono plan na ${data.newPlan.name} (${data.newPlan.price} ${data.newPlan.currency})`
      );
      window.location.reload();
    } catch (err: any) {
      console.error("❌ Błąd zmiany planu:", err.message);
      setConfirmError(err.message || "Błąd zmiany planu");
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <div
        key={_key}
        className={clsx(
          "group flex flex-col items-center mx-4 rounded-2xl bg-background-card w-[260px] px-4 pb-8 relative cursor-pointer transition-transform duration-300 hover:-translate-y-2",
          {
            "border-2 border-color-secondary pt-12": highlighted,
            "pt-8": !highlighted,
          }
        )}
      >
        {highlightedText && (
          <div className="bg-color-secondary px-4 py-3 rounded-full mb-4 absolute top-[-22px]">
            <p className="text-sm text-color-primary font-bold">
              {highlightedText}
            </p>
          </div>
        )}
        <h3 className="text-2xl font-bold text-center mb-2 text-color-secondary">
          {title}
        </h3>
        <div className="my-4 h-10">
          {price ? (
            <p className="text-color-primary font-bold text-2xl">
              {price} zł
              <span className="text-color-tertiary text-sm">/miesiąc</span>
            </p>
          ) : (
            <Loader2 className="animate-spin text-color-tertiary" />
          )}
        </div>

        {advantages && (
          <ul className="mb-0 space-y-2 w-full px-2">
            {advantages.map((advantage) => (
              <li
                key={advantage}
                className={`text-color-primary text-sm pl-6 relative before:content-['✓'] before:absolute before:left-0`}
              >
                {advantage}
              </li>
            ))}
          </ul>
        )}

        {!currentPlanId && !isDataLoading && (
          <Button
            text={"Wybierz plan"}
            className="w-full mt-6"
            variant={highlighted ? "default" : "outline"}
            onClick={openPaymentModal}
          />
        )}

        {currentPlanId &&
          currentPlanPrice &&
          price &&
          price > currentPlanPrice &&
          sessionStatus === "authenticated" && (
            <Button
              text={"Aktualizuj plan"}
              className="w-full mt-6"
              variant={highlighted ? "default" : "outline"}
              onClick={openConfirmModal}
              disabled={confirmLoading}
            />
          )}

        {currentPlanId === planId && !isDataLoading && (
          <p className="text-md text-color-tertiary mt-6 font-bold">
            Aktualny plan
          </p>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-lg bg-background-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Wybierz metodę płatności</h4>
              <button
                onClick={closeModal}
                aria-label="Zamknij"
                className="text-color-tertiary hover:opacity-80"
                disabled={modalLoading}
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-color-primary mb-4">
              Możesz zapłacić jednorazowo lub wykupić comiesięczną subskrypcję.
            </p>

            {modalError && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                {modalError}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Button
                  text={
                    modalLoading ? "Przekierowuję..." : "Płatność jednorazowa"
                  }
                  className="w-full"
                  variant="default"
                  onClick={handleOneTimePurchase}
                  disabled={modalLoading}
                />
                <Button
                  text={
                    modalLoading
                      ? "Przekierowuję..."
                      : "Płatność cykliczna (subskrypcja)"
                  }
                  className="w-full"
                  variant={"outline"}
                  onClick={handleSubscriptionPurchase}
                  disabled={modalLoading}
                />
              </div>

              <div className="mt-2 text-right">
                <button
                  onClick={closeModal}
                  className="text-sm text-color-tertiary underline"
                  disabled={modalLoading}
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-lg bg-background-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Potwierdź aktualizację</h4>
            </div>

            <p className="text-sm text-color-primary mb-4">
              Czy na pewno chcesz zaktualizować swój plan na &quot;{title}
              &quot;?
            </p>

            {confirmError && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                {confirmError}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 rounded bg-transparent text-color-tertiary underline"
                disabled={confirmLoading}
              >
                Anuluj
              </button>
              <Button
                text={confirmLoading ? "Aktualizuję..." : "OK"}
                className="px-4 py-2"
                variant="default"
                onClick={handleChangePlan}
                disabled={confirmLoading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
