import { TechPartnersCards as SanityTechPartnersCards } from "@/sanity.types";
import React from "react";
import { Link } from "@/app/components/atoms/BaseLink";
import { TechnologyCardsSection } from "@/components/blocks/technology-cards-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type TechPartnersCardsSectionProps = Omit<
  SanityTechPartnersCards,
  "cards"
> & {
  cards?: (Omit<
    NonNullable<SanityTechPartnersCards["cards"]>[number],
    "link" | "image"
  > & {
    link?: Link;
    image: BaseImageProps;
  })[];
};

export interface TechPartnersCardsProps {
  block: TechPartnersCardsSectionProps;
}

export const TechPartnersCards = ({ block }: TechPartnersCardsProps) => {
  const { title, cards, backgroundColor } = block;

  return (
    <TechnologyCardsSection
      title={title}
      cards={cards}
      backgroundColor={backgroundColor}
    />
  );
};
