import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { TwoColumnsFeatures } from "@/sanity.types";
import { Check } from "lucide-react";

interface FeatureColumnsSectionProps
  extends Omit<TwoColumnsFeatures, "_type"> {}

export function FeatureColumnsSection({
  title,
  leftColumn,
  rightColumn,
  backgroundColor,
}: FeatureColumnsSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-secondary text-secondary-foreground"
    >
      <div className="mx-auto max-w-4xl px-6">
        <PortableText
          value={title}
          className="mx-auto mb-12 max-w-lg md:mb-16"
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <PortableText
            value={leftColumn}
            className="flex w-full flex-col gap-4 md:gap-6"
            listBullet={
              <Check className="text-secondary-foreground h-5 w-5 shrink-0" />
            }
            ulClassName="flex flex-col gap-3 lg:gap-5"
            liClassName="flex items-center gap-4 font-medium"
          />
          <PortableText
            value={rightColumn}
            className="flex w-full flex-col gap-4 md:gap-6"
            listBullet={
              <Check className="text-secondary-foreground h-5 w-5 shrink-0" />
            }
            ulClassName="flex flex-col gap-3 lg:gap-5"
            liClassName="flex items-center gap-4 font-medium"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
