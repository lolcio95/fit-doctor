import { IconHighlights as SanityIconHighlights } from "@/sanity.types";
import React from "react";
import { ValuesSection } from "@/components/blocks/values-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export interface IconHighlightsSectionProps
  extends Omit<SanityIconHighlights, "highlights"> {
  highlights?: (Omit<
    NonNullable<SanityIconHighlights["highlights"]>[number],
    "icon"
  > & {
    icon?: BaseImageProps;
  })[];
}

export interface IconHighlightsProps {
  block: IconHighlightsSectionProps;
}

export const IconHighlights = ({ block }: IconHighlightsProps) => {
  const { highlights, title, backgroundColor } = block;

  return (
    <ValuesSection
      title={title}
      highlights={highlights}
      backgroundColor={backgroundColor}
    />
  );
};
