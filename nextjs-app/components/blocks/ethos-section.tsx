import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { EthosSectionProps as ComponentEthosSectionProps } from "@/app/components/organisms/Ethos";
import { ArrowRight } from "lucide-react";

interface EthosSectionProps extends Omit<ComponentEthosSectionProps, "_type"> {}

export function EthosSection({
  button,
  person,
  content,
  subtitle,
  backgroundColor,
}: EthosSectionProps) {
  const { firstName = "", lastName = "", picture, position } = person || {};
  const personName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-secondary text-secondary-foreground"
      className="py-16 lg:py-24"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <MediaImage
            simpleImage={picture}
            width={460}
            height={460}
            className="aspect-square w-full rounded-xl object-cover lg:max-w-[460px]"
          />
          <div className="flex flex-col gap-8 lg:gap-12 lg:items-start">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                {subtitle && (
                  <p className="font-semibold text-[#36B2FA]">{subtitle}</p>
                )}
                <PortableText value={content} />
                <cite className="font-semibold not-italic">
                  {personName}
                  <br />
                  {position}
                </cite>
              </div>
            </div>
            {button?.label && (
              <ButtonLink
                link={button}
                className="w-full lg:w-auto"
                variant="secondary"
                icon={<ArrowRight />}
              />
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
