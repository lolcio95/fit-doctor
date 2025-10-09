import { PortableText } from "@/app/components/atoms/PortableText";
import { HubspotForm } from "@/app/components/molecules/HubspotForm";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { Newsletter as SanityNewsletter } from "@/sanity.types";

interface NewsletterSectionProps extends Omit<SanityNewsletter, "_type"> {}

export function NewsletterSection({
  content,
  formId,
  backgroundColor,
}: NewsletterSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-slate-50"
    >
      <div className="container mx-auto px-6">
        <div className="flex w-full flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div className="flex max-w-lg flex-col gap-4 md:gap-5">
            <PortableText value={content} />
          </div>
          <HubspotForm formId={formId} />
        </div>
      </div>
    </SectionWrapper>
  );
}
