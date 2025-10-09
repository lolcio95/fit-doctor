import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { CTASectionProps } from "@/app/components/organisms/CTA";

interface CtaSectionProps extends Omit<CTASectionProps, "_type"> {}

export function CtaSection({ button, text, backgroundColor }: CtaSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-secondary from-primary/0 via-primary/30 to-primary/0 gradient bg-gradient-to-r text-secondary-foreground"
      className="py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <PortableText value={text} />
        </div>
        {button?.label && <ButtonLink link={button} />}
      </div>
    </SectionWrapper>
  );
}
