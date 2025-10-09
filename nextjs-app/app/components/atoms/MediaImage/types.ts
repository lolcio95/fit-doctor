import {
  BaseImageProps,
  BaseMediaImageProps,
  ImageBaseComponentProps,
} from "../BaseImage/types";

export interface MediaImageProps
  extends Pick<
    ImageBaseComponentProps,
    "placeholder" | "height" | "width" | "sizes" | "priority" | "loading"
  > {
  simpleImage?: BaseImageProps;
  mediaImage?: BaseMediaImageProps;
  asSvg?: boolean;
  className?: string;
}
