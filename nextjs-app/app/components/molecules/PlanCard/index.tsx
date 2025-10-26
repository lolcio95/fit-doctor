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
  const { _key, highlighted, highlightedText, title, advantages, priceId } =
    planData;
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const isDataLoading =
    planDataLoading || loading || sessionStatus === "loading";

  const fetchProductByPrice = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/plans/product-by-price-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, email: sessionData?.user?.email }),
    });

    const data = await res.json();
    setPrice(data.product.price / 100);
    setPlanId(data.product.id);
    setLoading(false);
  }, [priceId, sessionData?.user?.email]);

  useEffect(() => {
    fetchProductByPrice();
  }, [fetchProductByPrice]);

  const handleSelectPlan = async () => {
    if (sessionStatus !== "authenticated") {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/subscriptions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: sessionData?.user?.email }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Błąd odpowiedzi z backendu:", text);
        alert("Błąd podczas tworzenia sesji płatności. Sprawdź konsolę.");
        return;
      }

      const data = await res.json();
      if (!data.url) {
        alert("Brak URL do checkoutu w odpowiedzi.");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert("Coś poszło nie tak. Sprawdź konsolę.");
    }
  };

  const handleChangePlan = async () => {
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

      if (!res.ok) throw new Error(data.error || "Błąd aktualizacji planu");

      alert(
        `Zmieniono plan na ${data.newPlan.name} (${data.newPlan.price} ${data.newPlan.currency})`
      );
      window.location.reload();
    } catch (err: any) {
      console.error("❌ Błąd zmiany planu:", err.message);
      alert(err.message);
    }
  };

  return (
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
              className="text-color-primary text-sm pl-6 relative before:content-['✓'] before:absolute before:left-0"
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
          onClick={handleSelectPlan}
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
            onClick={handleChangePlan}
          />
        )}
      {currentPlanId === planId && !isDataLoading && (
        <p className="text-md text-color-tertiary mt-6 font-bold">
          Aktualny plan
        </p>
      )}
    </div>
  );
};
