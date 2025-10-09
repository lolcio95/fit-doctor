import { Faq as SanityFAQ } from "@/sanity.types";
import React from "react";
import { FaqSection } from "@/components/blocks/faq-section";

export interface FAQProps {
  block: SanityFAQ;
}

export const FAQ = ({ block }: FAQProps) => {
  const { content, groups, backgroundColor } = block;

  return (
    <FaqSection
      content={content}
      groups={groups}
      backgroundColor={backgroundColor}
    />
  );
};
