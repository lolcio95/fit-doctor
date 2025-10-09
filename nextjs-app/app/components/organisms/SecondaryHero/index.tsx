import { SecondaryHero as SanitySecondaryHero } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { HeaderSection } from "@/components/blocks/header-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type SecondaryHeroSectionProps = Omit<
  SanitySecondaryHero,
  "button" | "logo"
> & {
  button?: LabeledLinkType;
  logo?: BaseImageProps;
};

export interface SecondaryHeroProps {
  block: SecondaryHeroSectionProps;
}

export const SecondaryHero = ({ block }: SecondaryHeroProps) => {
  const { tag, title, button, logo, backgroundColor, withButton, withImage } =
    block;

  return (
    <HeaderSection
      tag={tag}
      title={title}
      button={button}
      logo={logo}
      withButton={withButton}
      backgroundColor={backgroundColor}
      withImage={withImage}
    />
  );
};
