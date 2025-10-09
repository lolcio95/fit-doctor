import { SanityImageAsset } from "@/sanity.types";
import { BaseImageReturnType } from "./types";

export const getImageProps = (
  image:
    | {
        asset: Pick<SanityImageAsset, "metadata" | "url">;
      }
    | null
    | undefined,
  alt: string | null | undefined
): BaseImageReturnType => {
  const { asset } = image || {};
  const { url, metadata } = asset || {};

  const { dimensions, lqip } = metadata || {};
  const { width, height, aspectRatio } = dimensions || {};

  return {
    src: url || "",
    alt: alt || "",
    height: height || undefined,
    width: width || undefined,
    blurDataURL: lqip || undefined,
    aspectRatio: aspectRatio || undefined,
  };
};
