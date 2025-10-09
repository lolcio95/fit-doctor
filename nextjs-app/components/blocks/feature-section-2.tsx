import { PortableText } from "@/app/components/atoms/PortableText";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import clsx from "clsx";
import { TwoColumnsSectionProps } from "@/app/components/organisms/TwoColumns";
import { FC } from "react";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

export const FeatureSection2: FC<TwoColumnsSectionProps> = ({
  text,
  image,
  imagePosition,
  backgroundColor,
}) => (
  <SectionWrapper
    backgroundColor={backgroundColor}
    defaultBgClassName="bg-background"
    className="py-16 md:py-24"
  >
    <div className="container mx-auto flex flex-col gap-10 px-6 md:gap-12">
      <div className={"grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2"}>
        <div
          className={clsx(
            "flex flex-col items-start justify-center gap-4 md:gap-6",
            {
              "order-2": imagePosition === "left",
            }
          )}
        >
          <PortableText value={text} />
        </div>
        <MediaImage
          mediaImage={image}
          width={1200}
          height={1200}
          className={clsx("rounded-xl object-cover", {
            "order-1": imagePosition === "left",
          })}
        />
      </div>
    </div>
  </SectionWrapper>
);
