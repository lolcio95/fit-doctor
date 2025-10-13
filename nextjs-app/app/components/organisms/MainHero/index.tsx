import { MainHero as SanityMainHero } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { HeroSection } from "@/components/blocks/hero-section";
import { BaseMediaImageProps } from "@/app/components/atoms/BaseImage/types";

export type MainHeroSectionProps = Omit<SanityMainHero, "button" | "image"> & {
  button?: LabeledLinkType;
  image?: BaseMediaImageProps;
};

export interface MainHeroProps {
  block: MainHeroSectionProps;
}
export const MainHero = ({ block }: MainHeroProps) => {
  const { title, description, button, image, backgroundColor } = block;

  return (
    <HeroSection
      title={title}
      description={description}
      button={button}
      image={image}
      backgroundColor={backgroundColor}
    />
  );
};
