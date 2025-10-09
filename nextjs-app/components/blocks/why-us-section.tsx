import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { WhyUs } from "@/sanity.types";
import { Check } from "lucide-react";
import { FC } from "react";

interface WhyUsSectionProps {
  block: Omit<WhyUs, "image" | "button"> & {
    image: BaseImageProps;
    button: LabeledLinkType;
  };
}

const WhyUsSection: FC<WhyUsSectionProps> = ({ block }) => {
  const { button, content, image, backgroundColor } = block;

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-slate-50"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-8">
            {content && (
              <PortableText
                value={content}
                listBullet={<Check className="text-primary h-5 w-5" />}
                ulClassName="flex flex-col gap-3"
                liClassName="flex items-center gap-3 font-medium"
              />
            )}
            {!!button?.label && <ButtonLink link={button} />}
          </div>
          {image && (
            <MediaImage
              simpleImage={image}
              width={1000}
              height={1000}
              className="aspect-square rounded-lg object-cover"
            />
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default WhyUsSection;
