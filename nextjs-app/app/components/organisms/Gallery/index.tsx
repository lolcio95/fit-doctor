import { Gallery as SanityGallery } from "@/sanity.types";
import React from "react";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";
import { GallerySection } from "@/components/blocks/gallery-carousel";

export type SanityGallerySectionProps = Omit<SanityGallery, "gallery"> & {
  gallery: BaseImageProps[];
};

export interface GalleryProps {
  block: SanityGallerySectionProps;
}

export const Gallery = ({ block }: GalleryProps) => {
  const { title, description, backgroundColor, gallery } = block;
  return (
    <GallerySection
      gallery={gallery ?? []}
      backgroundColor={backgroundColor}
      title={title}
      description={description}
    />
  );
};
