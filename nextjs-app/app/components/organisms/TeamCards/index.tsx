import { Person, TeamCards as SanityTeamCards } from "@/sanity.types";
import React from "react";
import { TeamSection } from "@/components/blocks/team-section";

export type TeamCardsSectionProps = Omit<SanityTeamCards, "cards"> & {
  cards?: (Omit<NonNullable<SanityTeamCards["cards"]>[number], "person"> & {
    person?: Person;
  })[];
};

export interface TeamCardsProps {
  block: TeamCardsSectionProps;
}

export const TeamCards = ({ block }: TeamCardsProps) => {
  const { title, cards, backgroundColor } = block;

  return (
    <TeamSection
      title={title}
      cards={cards}
      backgroundColor={backgroundColor}
    />
  );
};
