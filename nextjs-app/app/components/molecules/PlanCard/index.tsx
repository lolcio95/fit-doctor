"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Plans } from "@/sanity.types";
import { Button } from "@/app/components/atoms/Button";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import PaymentModal from "./compoments/PaymentModal";
import ConfirmModal from "./compoments/ConfirmModal";

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

  const handleSubscriptionPurchase = async (phone?: string) => {
    setModalError(null);
    setModalLoading(true);

    try {
      const res = await fetch("/api/subscriptions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          email: sessionData?.user?.email,
          phone,
        }),
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

  const handleOneTimePurchase = async (phone?: string) => {
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
          phone,
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

      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        loading={modalLoading}
        error={modalError}
        onOneTime={(phone?: string) => void handleOneTimePurchase(phone)}
        onSubscription={(phone?: string) =>
          void handleSubscriptionPurchase(phone)
        }
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={closeConfirmModal}
        loading={confirmLoading}
        error={confirmError}
        onConfirm={() => void handleChangePlan()}
        title={title}
      />
    </>
  );
};
