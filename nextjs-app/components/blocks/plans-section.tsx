"use client";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { Plans as PlansProps } from "@/sanity.types";
import { PlanCard } from "@/app/components/molecules/PlanCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
interface PlansSectionProps extends Omit<PlansProps, "_type"> {}

export function PlansSection({
  title,
  description,
  plans,
  backgroundColor,
}: PlansSectionProps) {
  const { data: sessionData } = useSession();
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [userPlanPrice, setUserPlanPrice] = useState<number | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionItemId, setSubscriptionItemId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const getUserPlan = async (email: string) => {
    setLoading(true);
    const res = await fetch("/api/plans/user-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setCurrentPlanId(data.plan?.id || null);
    setUserPlanPrice(data.plan?.price || null);
    setSubscriptionId(data.subscriptionId || null);
    setSubscriptionItemId(data.subscriptionItemId || null);
    setLoading(false);
  };

  useEffect(() => {
    if (sessionData?.user?.email) {
      getUserPlan(sessionData.user.email);
    }
  }, [sessionData?.user?.email]);

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-slate-50"
    >
      {(title || description) && (
        <div className="text-center max-w-3xl mx-auto mb-12 px-4">
          {title && (
            <h2 className="text-3xl lg:text-4xl font-extrabold text-color-secondary mb-4">
              {title}
            </h2>
          )}
          {description && <p className="text-md lg:text-lg">{description}</p>}
        </div>
      )}
      <div className="container mx-auto px-6 flex flex-wrap justify-center items-start gap-8">
        {plans &&
          plans.map((plan) => (
            <PlanCard
              key={plan._key}
              planData={plan}
              planDataLoading={loading}
              currentPlanId={currentPlanId}
              currentPlanPrice={userPlanPrice}
              currentSubscriptionId={subscriptionId}
              subscriptionItemId={subscriptionItemId}
            />
          ))}
      </div>
    </SectionWrapper>
  );
}
