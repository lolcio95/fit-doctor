import { WhyUs as SanityWhyUs } from "@/sanity.types";
import React from "react";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";
import { WhyUsSection } from "@/components/blocks/whyUs";

export type SanityWhyUsSectionProps = Omit<SanityWhyUs, "whyUs"> & {
  whyUs:
    | (Omit<NonNullable<SanityWhyUs["whyUs"]>[number], "image"> & {
        image?: BaseImageProps;
      })[]
    | null;
};

export interface WhyUsProps {
  block: SanityWhyUsSectionProps;
}

export const WhyUs = ({ block }: WhyUsProps) => {
  const { backgroundColor, whyUs, title, description } = block;

  return (
    <WhyUsSection
      whyUs={whyUs ?? []}
      backgroundColor={backgroundColor}
      title={title}
      description={description}
    />
  );
};
