"use client";

import React, { FC } from "react";
import { useSvg } from "./hooks";
import { MediaImageProps } from "./types";

const SVGImage: FC<Pick<MediaImageProps, "simpleImage" | "className">> = ({
  simpleImage,
  className,
}) => {
  const { svgContent } = useSvg(simpleImage?.image.asset.url ?? "");

  if (svgContent) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{
          __html: svgContent,
        }}
      />
    );
  }

  return null;
};

export default SVGImage;
