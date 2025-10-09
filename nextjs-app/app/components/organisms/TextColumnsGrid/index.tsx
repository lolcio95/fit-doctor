import { FeatureSection4 } from "@/components/blocks/feature-section-4";
import { TextColumnsGrid as SanityTextColumnsGrid } from "@/sanity.types";
import React from "react";

export interface TextColumnGridProps {
  block: SanityTextColumnsGrid;
}

export const TextColumnsGrid = ({ block }: TextColumnGridProps) => {
  return <FeatureSection4 {...block} />;
};
