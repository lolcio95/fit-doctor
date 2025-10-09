import { PortableText } from "@/app/components/atoms/PortableText";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { FeaturesWithIconsSectionProps } from "@/app/components/organisms/FeaturesWithIcons";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface FeatureIconsSectionProps
  extends Omit<FeaturesWithIconsSectionProps, "_type"> {}

export function FeatureIconsSection({
  title,
  cards,
  backgroundColor,
}: FeatureIconsSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-background"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto flex flex-col items-center gap-10 px-6 md:gap-12">
        <PortableText value={title} className="max-w-lg" />
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
          {cards?.map((card) => (
            <div
              className="flex flex-col items-center text-center"
              key={card._key}
            >
              <div className="bg-background mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border shadow-xs">
                <MediaImage simpleImage={card.icon} className="w-5 h-5" />
              </div>
              <PortableText value={card.content} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
