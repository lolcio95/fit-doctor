import { Media, SanityImageAsset, SimpleImage } from "@/sanity.types";
import { ImgHTMLAttributes } from "react";
import {ImageProps} from 'next/image';

export interface BaseImageProps
  extends NonNullable<Omit<SimpleImage, "image" | "caption" | "_type">> {
  image: {
    asset: Pick<SanityImageAsset, "metadata" | "url">;
  };
}

export interface BaseMediaImageProps
  extends Omit<Media, "mobileImage" | "desktopImage"> {
  mobileImage: Omit<Media["mobileImage"], "asset"> & {
    asset: Pick<SanityImageAsset, "metadata" | "url">;
  };
  desktopImage: Omit<Media["desktopImage"], "asset"> & {
    asset: Pick<SanityImageAsset, "metadata" | "url">;
  };
}

export interface ImageBaseComponentProps extends BaseImageProps {
  placeholder?: "blur" | "empty";
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  loading?: ImageProps['loading'];
}

export interface BaseImageReturnType
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
  width?: Exclude<ImgHTMLAttributes<HTMLImageElement>["width"], string>;
  height?: Exclude<ImgHTMLAttributes<HTMLImageElement>["height"], string>;
  blurDataURL?: string;
  aspectRatio?: number;
}
