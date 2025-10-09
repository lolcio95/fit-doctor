import { PortableText } from "@/app/components/atoms/PortableText";
import { ContactForm } from "@/sanity.types";
import { HubspotForm } from "@/app/components/molecules/HubspotForm";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import clsx from "clsx";

interface TextPlusEmbedSection extends ContactForm {}

export function TextPlusEmbedSection({
  withContent,
  content,
  formId,
  backgroundColor,
}: TextPlusEmbedSection) {
  return (
    <SectionWrapper
      className={clsx({
        "py-16 md:py-24": withContent,
      })}
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-background"
    >
      <div
        className={clsx("mx-auto flex flex-col gap-10 md:gap-12", {
          "container px-6": withContent,
        })}
      >
        <div
          className={clsx("grid grid-cols-1 gap-8 md:gap-12", {
            "lg:grid-cols-2": withContent,
          })}
        >
          {withContent && (
            <div className="flex flex-col items-start justify-center gap-4 md:gap-6">
              <PortableText value={content} />
            </div>
          )}
          <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center py-16 md:py-24">
            <HubspotForm formId={formId} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
