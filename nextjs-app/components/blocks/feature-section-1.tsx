import { FeaturesWithImageSectionProps } from "@/app/components/organisms/FeaturesWithImage";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface FeatureSection1Props
  extends Omit<FeaturesWithImageSectionProps, "_type"> {}

export function FeatureSection1({
  image,
  title,
  cards,
  backgroundColor,
}: FeatureSection1Props) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-background"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <MediaImage
            mediaImage={image}
            className="order-last aspect-square rounded-xl object-cover lg:order-first lg:aspect-[4/5]"
          />
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <PortableText value={title} />
            </div>

            <div className="flex flex-col gap-8">
              {cards?.map((card) => (
                <div
                  className="flex flex-col gap-5 lg:flex-row"
                  key={card._key}
                >
                  <div className="bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-md border shadow-xs">
                    <MediaImage
                      simpleImage={card.icon}
                      className="text-primary h-5 w-5"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <PortableText value={card.content} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
