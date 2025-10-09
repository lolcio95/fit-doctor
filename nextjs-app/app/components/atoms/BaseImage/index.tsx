"use client";

import React, { FC } from "react";
import NextImage, { ImageLoader } from "next/image";

import { ImageBaseComponentProps } from "./types";
import { blurDataURLPlaceholder } from "./consts";
import { getImageProps } from "./utils";

export const imageLoader: ImageLoader = ({ src, width, quality }) =>
  `${src}?w=${width}&q=${quality || 75}&auto=format&fit=max`;

const BaseImage: FC<ImageBaseComponentProps> = ({
  image,
  alt,
  placeholder: placeholderProp = "blur",
  height: heightProp,
  width: widthProp,
  sizes: sizesProp,
  priority,
  className,
}) => {
  const imageData = getImageProps(image, alt);

  if (!imageData.src) {
    return null;
  }

  const {
    src,
    sizes: imageDataSizesProp,
    blurDataURL = blurDataURLPlaceholder,
    height,
    width,
    aspectRatio,
    ...rest
  } = imageData;

  const placeholder = placeholderProp === "blur" ? "blur" : "empty";
  const sizes =
    sizesProp ||
    imageDataSizesProp ||
    "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  const imageHeight =
    heightProp || (widthProp && aspectRatio ? widthProp * aspectRatio : height);
  const imageWidth =
    widthProp || (heightProp && aspectRatio ? heightProp / aspectRatio : width);

  return (
    <NextImage
      placeholder={placeholder}
      sizes={sizes}
      width={imageWidth}
      height={imageHeight}
      src={src}
      loader={imageLoader}
      blurDataURL={blurDataURL}
      alt={alt ?? ""}
      className={className}
      priority={priority}
      {...rest}
    />
  );
};

export default BaseImage;
