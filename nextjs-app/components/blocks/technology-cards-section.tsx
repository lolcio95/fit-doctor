import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TechPartnersCardsSectionProps } from "@/app/components/organisms/TechPartnersCards";
import { PortableText } from "@/app/components/atoms/PortableText";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { BaseLink } from "@/app/components/atoms/BaseLink";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface TechnologyCardsSectionProps
  extends Omit<TechPartnersCardsSectionProps, "_type"> {}

export function TechnologyCardsSection({
  title,
  cards,
  backgroundColor,
}: TechnologyCardsSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-slate-50"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto flex flex-col items-center gap-10 px-6 md:gap-12">
        <PortableText value={title} />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards?.map((card) => (
            <BaseLink link={card.link} key={card._key}>
              <Card className="w-full shadow-xs">
                <CardHeader className="relative">
                  <AspectRatio
                    ratio={4 / 3}
                    className="flex justify-center items-center bg-slate-100 p-4"
                  >
                    <MediaImage
                      simpleImage={card.image}
                      className="max-w-full max-h-full object-contain"
                    />
                  </AspectRatio>
                  <CardTitle className="text-bold mt-4">{card.title}</CardTitle>
                </CardHeader>
              </Card>
            </BaseLink>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
