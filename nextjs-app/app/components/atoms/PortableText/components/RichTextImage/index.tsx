"use client";

import React, { FC } from "react";

import { SimpleImage } from "@/sanity.types";
import BaseImage from "@/app/components/atoms/BaseImage";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

interface RichTextImageProps {
  value: Omit<SimpleImage, "image"> & BaseImageProps;
  placeholder?: "blur" | "empty";
}

const RichTextImage: FC<RichTextImageProps> = ({
  value,
  placeholder = "blur",
}) => {
  const { alt, image, caption } = value || {};

  if (!image) {
    return null;
  }

  return (
    <figure className="inline-block w-full h-full">
      <BaseImage
        image={image}
        alt={alt ?? ""}
        placeholder={placeholder}
        className="max-w-full rounded-2xl shadow-md transition-shadow object-cover"
      />

      {caption && (
        <figcaption className="text-foreground text-sm mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default RichTextImage;
