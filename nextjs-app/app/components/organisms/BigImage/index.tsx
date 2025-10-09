import { BigImage as SanityBigImage } from "@/sanity.types";
import React from "react";
import { TeamImageSection } from "@/components/blocks/team-image-section";
import { BaseMediaImageProps } from "@/app/components/atoms/BaseImage/types";

export interface BigImageSectionProps
  extends Omit<SanityBigImage, "_type" | "image"> {
  image: BaseMediaImageProps;
}
export interface BigImageProps {
  block: BigImageSectionProps;
}

export const BigImage = ({ block }: BigImageProps) => {
  const { title, image, backgroundColor } = block;

  return (
    <TeamImageSection
      title={title}
      image={image}
      backgroundColor={backgroundColor}
    />
  );
};
