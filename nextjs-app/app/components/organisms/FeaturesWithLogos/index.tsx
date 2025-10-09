import { FeaturesWithLogos as SanityFeaturesWithLogos } from "@/sanity.types";
import React from "react";
import { Link } from "@/app/components/atoms/BaseLink";
import FeatureSection3 from "@/components/blocks/feature-section-3";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type FeaturesWithLogosSection = Omit<
  SanityFeaturesWithLogos,
  "features" | "logos"
> & {
  features?: (Omit<
    NonNullable<SanityFeaturesWithLogos["features"]>[number],
    "link"
  > & {
    link?: Link;
  })[];
  logos?: (Omit<
    NonNullable<SanityFeaturesWithLogos["logos"]>[number],
    "image"
  > &
    BaseImageProps)[];
};

export interface FeaturesWithLogosProps {
  block: FeaturesWithLogosSection;
}

export const FeaturesWithLogos = ({ block }: FeaturesWithLogosProps) => {
  const { title, features, logos, backgroundColor } = block;

  return (
    <FeatureSection3
      title={title}
      features={features}
      logos={logos}
      backgroundColor={backgroundColor}
    />
  );
};
