import { Plans as PlansProps } from "@/sanity.types";
import React from "react";
import { PlansSection } from "@/components/blocks/plans-section";

export interface PlansPropsSection {
  block: PlansProps;
}

export const Plans = ({ block }: PlansPropsSection) => {
  const { backgroundColor, title, description, plans } = block;

  return (
    <PlansSection
      title={title}
      description={description}
      backgroundColor={backgroundColor}
      plans={plans}
    />
  );
};
