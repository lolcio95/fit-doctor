import { PortableText } from "@/app/components/atoms/PortableText";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { LogosSectionProps } from "@/app/components/organisms/Logos";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

export function LogosSection({
  title,
  button,
  logos,
  withButton,
  backgroundColor,
}: LogosSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-background"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto flex flex-col items-center gap-8 px-6 md:gap-12">
        <PortableText value={title} />
        {withButton && button?.label && <ButtonLink link={button} />}
        {!!logos?.length && (
          <div className="flex gap-6 md:gap-10 flex-wrap justify-center">
            {logos.map((logo) => (
              <MediaImage
                key={logo._key}
                simpleImage={logo}
                width={200}
                height={50}
                className="object-contain max-w-full h-12"
                placeholder="empty"
              />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
