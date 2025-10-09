import { Advisor, ContactTeam as SanityContactTeam } from "@/sanity.types";
import React from "react";
import { ContactTeamSection } from "@/components/blocks/contact-team-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type ContactTeamSectionProps = Omit<SanityContactTeam, "advisors"> & {
  advisors?: (Omit<
    NonNullable<SanityContactTeam["advisors"]>[number],
    "advisor"
  > & {
    advisor?: Omit<Advisor, "picture"> & {
      picture: BaseImageProps;
    };
  })[];
};

export interface ContactTeamProps {
  block: ContactTeamSectionProps;
}

export const ContactTeam = ({ block }: ContactTeamProps) => {
  const { title, advisors, backgroundColor } = block;

  return (
    <ContactTeamSection
      title={title}
      advisors={advisors}
      backgroundColor={backgroundColor}
    />
  );
};
