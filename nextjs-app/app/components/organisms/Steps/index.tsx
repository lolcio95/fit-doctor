import { Steps as SanitySteps } from "@/sanity.types";
import React from "react";
import { StepsSection } from "@/components/blocks/steps-section";

export interface StepsProps {
  block: SanitySteps;
}

export const Steps = ({ block }: StepsProps) => {
  const { title, items, backgroundColor } = block;

  return (
    <StepsSection
      title={title}
      items={items}
      backgroundColor={backgroundColor}
    />
  );
};
