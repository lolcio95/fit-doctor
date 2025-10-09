import { FeaturesWithIcons as SanityFeaturesWithIcons } from "@/sanity.types";
import React from "react";
import { FeatureIconsSection } from "@/components/blocks/feature-icons-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export interface FeaturesWithIconsSectionProps
  extends Omit<SanityFeaturesWithIcons, "cards"> {
  cards?: (Omit<
    NonNullable<SanityFeaturesWithIcons["cards"]>[number],
    "icon"
  > & {
    icon: BaseImageProps;
  })[];
}

export interface FeaturesWithIconsProps {
  block: FeaturesWithIconsSectionProps;
}

export const FeaturesWithIcons = ({ block }: FeaturesWithIconsProps) => {
  const { title, cards, backgroundColor } = block;

  return (
    <FeatureIconsSection
      title={title}
      cards={cards}
      backgroundColor={backgroundColor}
    />
  );
};
