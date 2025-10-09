import { Card, CardHeader } from "@/components/ui/card";
import { FeaturesWithCardsSectionProps } from "@/app/components/organisms/FeaturesWithCards";
import { PortableText } from "@/app/components/atoms/PortableText";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { FC } from "react";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface FeatureCardsSectionProps
  extends Omit<FeaturesWithCardsSectionProps, "_type"> {}

const FeatureCardsSection: FC<FeatureCardsSectionProps> = ({
  title,
  cards,
  button,
  backgroundColor,
}) => (
  <SectionWrapper
    defaultBgClassName="bg-slate-50"
    backgroundColor={backgroundColor}
    className="py-16 md:py-24"
  >
    <div className="container mx-auto flex flex-col items-center gap-10 px-6 md:gap-12">
      <PortableText value={title} />
      {!!cards?.length && (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ _key, content, icon }) => (
            <Card className="w-full shadow-xs" key={_key}>
              <CardHeader>
                {icon && (
                  <div className="bg-muted mb-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-md overflow-hidden">
                    <MediaImage
                      simpleImage={icon}
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                )}
                <PortableText value={content} />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      {button?.label && (
        <ButtonLink
          link={button}
          linkClassName="w-full md:w-auto"
          className="w-full"
        />
      )}
    </div>
  </SectionWrapper>
);

export default FeatureCardsSection;
