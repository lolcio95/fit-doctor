import { ArrowRight } from "lucide-react";
import { PortableText } from "@/app/components/atoms/PortableText";
import clsx from "clsx";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { ListOfTwoColumnsSectionProps } from "@/app/components/organisms/ListOfTwoColumns";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

export function ListOfTwoColumnsFeature({
  title,
  list,
  firstImagePosition,
  imageAspectRatio,
  backgroundColor,
}: ListOfTwoColumnsSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-background"
    >
      <div className="container mx-auto flex flex-col gap-10 px-6 md:gap-12">
        {title && (
          <div className="lg:text-center">
            <PortableText value={title} />
          </div>
        )}

        {list?.length &&
          list.map((item, index) => {
            const { _key, text, button, displayButton, image } = item;
            return (
              <div
                className={clsx("flex flex-col gap-8 md:gap-12 lg:flex-row", {
                  "lg:flex-row-reverse":
                    (firstImagePosition === "left" && index % 2 === 0) ||
                    (firstImagePosition === "right" && index % 2 === 1),
                })}
                key={_key}
              >
                <div
                  className={clsx(
                    "flex flex-col items-start justify-center gap-4 md:gap-6 flex-1"
                  )}
                >
                  <PortableText value={text} />
                  {button?.label && displayButton && (
                    <ButtonLink
                      link={button}
                      variant="outline"
                      icon={<ArrowRight />}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <AspectRatio
                    ratio={imageAspectRatio === "4:3" ? 4 / 3 : 1 / 1}
                    className="rounded-xl overflow-hidden"
                  >
                    <MediaImage
                      mediaImage={image}
                      width={1200}
                      height={1200}
                      className={clsx(
                        "rounded-xl size-full",
                        item.imageAppearance === "cover"
                          ? "object-cover"
                          : "object-contain"
                      )}
                    />
                  </AspectRatio>
                </div>
              </div>
            );
          })}
      </div>
    </SectionWrapper>
  );
}
