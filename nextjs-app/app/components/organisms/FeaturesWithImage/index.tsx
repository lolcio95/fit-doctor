import { FeaturesWithImage as SanityFeaturesWithImage } from "@/sanity.types";
import React from "react";
import { FeatureSection1 } from "@/components/blocks/feature-section-1";
import {
  BaseImageProps,
  BaseMediaImageProps,
} from "@/app/components/atoms/BaseImage/types";

export interface FeaturesWithImageSectionProps
  extends Omit<SanityFeaturesWithImage, "cards" | "image"> {
  image: BaseMediaImageProps;
  cards?: (Omit<
    NonNullable<SanityFeaturesWithImage["cards"]>[number],
    "icon"
  > & {
    icon: BaseImageProps;
  })[];
}

export interface FeaturesWithImageProps {
  block: FeaturesWithImageSectionProps;
}

export const FeaturesWithImage = ({ block }: FeaturesWithImageProps) => {
  const { title, image, cards, backgroundColor } = block;

  return (
    <FeatureSection1
      image={image}
      title={title}
      cards={cards}
      backgroundColor={backgroundColor}
    />
  );
};
