import { DownloadCards as SanityDownloadCards } from "@/sanity.types";
import React from "react";
import { DownloadsSection } from "@/components/blocks/downloads-section";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export interface DownloadsSectionProps
  extends Omit<SanityDownloadCards, "_type" | "cards"> {
  cards?: (Omit<NonNullable<SanityDownloadCards["cards"]>[number], "image"> & {
    image?: BaseImageProps;
  })[];
}

export interface DownloadCardsProps {
  block: DownloadsSectionProps;
}

export const DownloadCards = ({ block }: DownloadCardsProps) => {
  const { cards, backgroundColor } = block;

  return <DownloadsSection cards={cards} backgroundColor={backgroundColor} />;
};
