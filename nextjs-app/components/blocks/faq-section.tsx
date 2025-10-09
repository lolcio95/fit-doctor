import { PortableText } from "@/app/components/atoms/PortableText";
import { Faq as SanityFAQ } from "@/sanity.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface FaqSectionProps extends Omit<SanityFAQ, "_type"> {}

export function FaqSection({
  content,
  groups,
  backgroundColor,
}: FaqSectionProps) {
  const faqGroups = groups?.filter((group) => !!group.items?.length) || [];

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-background"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <PortableText
            value={content}
            className="flex flex-1 flex-col gap-5"
          />
          {!!faqGroups.length && (
            <div className="flex flex-1 flex-col gap-8">
              {faqGroups.map(({ _key, groupTitle, items }) => (
                <div className="flex flex-col gap-2" key={_key}>
                  {groupTitle && (
                    <h2 className="text-lg font-semibold md:text-xl">
                      {groupTitle}
                    </h2>
                  )}
                  {!!items?.length && (
                    <Accordion
                      type="single"
                      collapsible
                      aria-label={`${groupTitle} FAQ items`}
                    >
                      {items?.map(
                        ({ _key: itemKey, question, answer }, index) => (
                          <AccordionItem
                            value={`item-${index + 1}`}
                            key={itemKey}
                          >
                            <AccordionTrigger className="text-left font-semibold">
                              {question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <PortableText value={answer} />
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
