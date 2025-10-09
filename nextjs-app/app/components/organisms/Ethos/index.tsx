import { Person, Ethos as SanityEthos } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { EthosSection } from "@/components/blocks/ethos-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type EthosSectionProps = Omit<SanityEthos, "button" | "person"> & {
  button: LabeledLinkType;
  person: Omit<Person, "picture"> & {
    picture: BaseImageProps;
  };
};

export interface EthosProps {
  block: EthosSectionProps;
}

export const Ethos = ({ block }: EthosProps) => {
  const { subtitle, content, person, button, backgroundColor } = block;

  return (
    <EthosSection
      subtitle={subtitle}
      content={content}
      person={person}
      button={button}
      backgroundColor={backgroundColor}
    />
  );
};
