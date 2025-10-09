"use client";

import React, { FC } from "react";
import clsx from "clsx";
import BaseImage from "../BaseImage";
import { MediaImageProps } from "./types";
import SVGImage from "./SVGImage";
import { useIsMobile } from "./hooks";

export const MediaImage: FC<MediaImageProps> = ({
  simpleImage,
  mediaImage,
  className,
  placeholder = "blur",
  height,
  width,
  sizes,
  priority,
  asSvg = false,
}) => {
  const isMobile = useIsMobile();

  if (asSvg) {
    return <SVGImage className={className} simpleImage={simpleImage} />;
  }

  if (mediaImage) {
    const { altText, desktopImage, mobileImage } = mediaImage;

    return (
      <BaseImage
        image={isMobile ? mobileImage : desktopImage}
        alt={altText ?? ""}
        className={clsx(className, "block")}
        placeholder={placeholder}
        height={height}
        width={width}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return simpleImage ? (
    <BaseImage
      image={simpleImage.image}
      alt={simpleImage.alt ?? ""}
      className={className}
      placeholder={placeholder}
      height={height}
      width={width}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
    />
  ) : null;
};
