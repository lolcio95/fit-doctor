import { PortableText } from "@/app/components/atoms/PortableText";
import { Badge } from "@/components/ui/badge";
import { Steps as SanitySteps } from "@/sanity.types";
import { cn } from "@/lib/utils";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface StepsSectionProps extends Omit<SanitySteps, "_type"> {}

export function StepsSection({
  items,
  title,
  backgroundColor,
}: StepsSectionProps) {
  const hasEvenItemsCount = items?.length ? items.length % 3 === 0 : false;
  const itemsToCenter = hasEvenItemsCount ? 0 : (items?.length || 1) % 3;

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-background"
    >
      <div className="container mx-auto flex flex-col items-center gap-10 px-6 md:gap-12">
        <PortableText value={title} />
        {!!items?.length && (
          <div className="grid w-full grid-cols-1 items-center gap-x-6 gap-y-12 lg:grid-cols-12 lg:justify-items-center">
            {items.map(({ _key, description, tag, title }, index) => (
              <div
                className={cn(
                  "col-span-12 flex flex-col items-center gap-5 text-center lg:col-span-4",
                  {
                    "lg:col-start-3":
                      itemsToCenter === 2 && index === items.length - 2,
                    "lg:col-start-7":
                      itemsToCenter === 2 && index === items.length - 1,
                    "lg:col-start-5":
                      itemsToCenter === 1 && index === items.length - 1,
                  }
                )}
                key={_key}
              >
                <div className="bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-lg font-bold shadow-xs">
                  {index + 1}
                </div>
                <div className="flex flex-col gap-3">
                  {title && <h3 className="font-bold">{title}</h3>}
                  <PortableText value={description} />
                </div>
                {tag && (
                  <Badge className="bg-muted text-foreground font-medium">
                    {tag}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
