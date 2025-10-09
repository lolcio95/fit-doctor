import { Newsletter as SanityNewsletter } from "@/sanity.types";
import React from "react";
import { NewsletterSection } from "@/components/blocks/newsletter-section";

export interface NewsletterProps {
  block: SanityNewsletter;
}

export const Newsletter = ({ block }: NewsletterProps) => {
  const { content, formId, backgroundColor } = block;

  return (
    <NewsletterSection
      content={content}
      formId={formId}
      backgroundColor={backgroundColor}
    />
  );
};
