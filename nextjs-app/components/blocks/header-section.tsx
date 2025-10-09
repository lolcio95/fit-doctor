import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { SecondaryHeroSectionProps } from "@/app/components/organisms/SecondaryHero";
import { checkIfIsLight } from "@/utils/colors";
import clsx from "clsx";

interface HeaderSectionProps extends Omit<SecondaryHeroSectionProps, "_type"> {}

export function HeaderSection({
  button,
  logo,
  tag,
  title,
  withButton,
  backgroundColor,
  withImage,
}: HeaderSectionProps) {
  const isLight = backgroundColor?.label
    ? checkIfIsLight(backgroundColor.label)
    : true;

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 lg:py-24"
      defaultBgClassName="bg-muted"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-6 text-center lg:gap-8">
          {withImage && logo?.image && (
            <MediaImage
              simpleImage={logo}
              width={200}
              height={200}
              placeholder="empty"
            />
          )}
          <div className="flex flex-col items-center gap-4 lg:gap-5">
            {tag && (
              <p
                className={clsx(
                  "flex h-6 items-center justify-center rounded-full px-2.5 text-sm font-semibold",
                  {
                    "bg-primary/5 text-foreground": isLight,
                    "bg-white/10 text-inherit": !isLight,
                  }
                )}
                aria-hidden="true"
              >
                {tag}
              </p>
            )}
            <PortableText value={title} />
          </div>
          {withButton && button?.label && (
            <ButtonLink variant="outline" link={button} />
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
