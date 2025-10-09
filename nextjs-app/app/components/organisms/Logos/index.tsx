import { Logos as SanityLogos } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { LogosSection } from "@/components/blocks/logos-section-2";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export type LogosSectionProps = Omit<SanityLogos, "button" | "logos"> & {
  button?: LabeledLinkType;
  logos?: (Omit<NonNullable<SanityLogos["logos"]>[number], "image"> &
    BaseImageProps)[];
};

export interface LogosProps {
  block: LogosSectionProps;
}

export const Logos = ({ block }: LogosProps) => <LogosSection {...block} />;
