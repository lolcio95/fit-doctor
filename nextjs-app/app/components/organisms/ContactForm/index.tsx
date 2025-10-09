import { ContactForm as SanityContactForm } from "@/sanity.types";
import React from "react";
import { TextPlusEmbedSection } from "@/components/blocks/text-plus-embed-section";

export interface ContactFormProps {
  block: SanityContactForm;
}

export const ContactForm = ({ block }: ContactFormProps) => {
  return <TextPlusEmbedSection {...block} />;
};
