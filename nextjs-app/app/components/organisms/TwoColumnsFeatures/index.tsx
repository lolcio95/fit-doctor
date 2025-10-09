import { TwoColumnsFeatures as SanityTwoColumnsFeatures } from "@/sanity.types";
import React from "react";
import { FeatureColumnsSection } from "@/components/blocks/feature-columns-section";

export interface TwoColumnsFeaturesProps {
  block: SanityTwoColumnsFeatures;
}

export const TwoColumnsFeatures = ({ block }: TwoColumnsFeaturesProps) => {
  const { title, leftColumn, rightColumn, backgroundColor } = block;

  return (
    <FeatureColumnsSection
      title={title}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      backgroundColor={backgroundColor}
    />
  );
};
