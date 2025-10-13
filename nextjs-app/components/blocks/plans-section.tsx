import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { Plans as PlansProps } from "@/sanity.types";
import { Button } from "@/app/components/atoms/Button";
import clsx from "clsx";
interface PlansSectionProps extends Omit<PlansProps, "_type"> {}

export function PlansSection({
  title,
  description,
  plans,
  backgroundColor,
}: PlansSectionProps) {
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
            <div
              key={plan._key}
              className={clsx(
                "group flex flex-col items-center mx-4 rounded-2xl bg-background-card w-[260px] px-4 pb-8 relative cursor-pointer transition-transform duration-300 hover:-translate-y-2",
                {
                  "border-2 border-color-secondary pt-12": plan.highlighted,
                  "pt-8": !plan.highlighted,
                }
              )}
            >
              {plan.highlightedText && (
                <div className="bg-color-secondary px-4 py-3 rounded-full mb-4 absolute top-[-22px]">
                  <p className="text-sm text-color-primary font-bold">
                    {plan.highlightedText}
                  </p>
                </div>
              )}
              <h3 className="text-2xl font-bold text-center mb-2 text-color-secondary">
                {plan.title}
              </h3>
              <p className="text-color-primary font-bold text-2xl my-4">
                {plan.price} zł
                <span className="text-color-tertiary text-sm">/miesiąc</span>
              </p>
              {plan.advantages && (
                <ul className="mb-0 space-y-2 w-full px-2">
                  {plan.advantages.map((advantage) => (
                    <li
                      key={advantage}
                      className="text-color-primary text-sm pl-6 relative before:content-['✓'] before:absolute before:left-0"
                    >
                      {advantage}
                    </li>
                  ))}
                </ul>
              )}
              <Button
                text="Wybierz plan"
                className="w-full mt-6"
                variant={plan.highlighted ? "default" : "outline"}
              />
            </div>
          ))}
      </div>
    </SectionWrapper>
  );
}
