import { Cta as SanityCta } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { CtaSection } from "@/components/blocks/cta-section";

export type CTASectionProps = Omit<SanityCta, "button"> & {
  button: LabeledLinkType;
};

export interface CTAProps {
  block: CTASectionProps;
}

export const CTA = ({ block }: CTAProps) => {
  const { button, text, backgroundColor } = block;

  return (
    <CtaSection button={button} text={text} backgroundColor={backgroundColor} />
  );
};
