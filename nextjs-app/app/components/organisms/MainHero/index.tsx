import { MainHero as SanityMainHero } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { HeroVideoSection } from "@/components/blocks/hero-video-section";
import { BaseMediaImageProps } from "@/app/components/atoms/BaseImage/types";

export type MainHeroSectionProps = Omit<SanityMainHero, "buttons" | "image"> & {
  buttons?: (Omit<NonNullable<SanityMainHero["buttons"]>[number], "link"> & {
    link?: LabeledLinkType;
  })[];
  image?: BaseMediaImageProps;
};

export interface MainHeroProps {
  block: MainHeroSectionProps;
}
export const MainHero = ({ block }: MainHeroProps) => {
  const { title, description, buttons, type, videoId, image, backgroundColor } =
    block;

  return (
    <HeroVideoSection
      title={title}
      description={description}
      buttons={buttons}
      type={type}
      videoId={videoId}
      image={image}
      backgroundColor={backgroundColor}
    />
  );
};
