import { Person, TeamIcons as SanityTeamIcons } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { TeamIntroSection } from "@/components/blocks/team-intro-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type TeamIntroSectionProps = Omit<
  SanityTeamIcons,
  "button" | "teamIcons"
> & {
  button?: LabeledLinkType;
  teamIcons?: Array<
    Omit<NonNullable<SanityTeamIcons["teamIcons"]>[number], "person"> & {
      person?: Omit<Person, "picture"> & {
        picture: BaseImageProps;
      };
    }
  >;
};

export interface TeamIntroProps {
  block: TeamIntroSectionProps;
}

export const TeamIcons = ({ block }: TeamIntroProps) => {
  const { title, button, teamIcons, backgroundColor } = block;

  return (
    <TeamIntroSection
      title={title}
      button={button}
      teamIcons={teamIcons}
      backgroundColor={backgroundColor}
    />
  );
};
