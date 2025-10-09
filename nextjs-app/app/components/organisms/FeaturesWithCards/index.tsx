import { FeaturesWithCards as SanityFeatureWithCards } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import FeatureCardsSection from "@/components/blocks/feature-cards-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type FeaturesWithCardsSectionProps = Omit<
  SanityFeatureWithCards,
  "button" | "cards"
> & {
  button: LabeledLinkType;
  cards?: (Omit<
    NonNullable<SanityFeatureWithCards["cards"]>[number],
    "icon"
  > & {
    icon: BaseImageProps;
  })[];
};

export interface FeaturesWithCardsProps {
  block: FeaturesWithCardsSectionProps;
}
export const FeaturesWithCards = ({ block }: FeaturesWithCardsProps) => {
  const { button, cards, title, backgroundColor } = block;

  return (
    <FeatureCardsSection
      title={title}
      cards={cards}
      button={button}
      backgroundColor={backgroundColor}
    />
  );
};
