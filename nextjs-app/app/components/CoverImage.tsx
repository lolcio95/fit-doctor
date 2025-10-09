import { MediaImage } from "./atoms/MediaImage";
import { MediaImageProps } from "./atoms/MediaImage/types";
import { FC } from "react";
import clsx from "clsx";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CoverImageProps extends MediaImageProps {
  priority?: boolean;
}

const CoverImage: FC<CoverImageProps> = ({
  className,
  height,
  mediaImage,
  placeholder = "empty",
  priority,
  simpleImage,
  width,
}) => {
  const image =
    mediaImage || simpleImage ? (
      <AspectRatio ratio={16 / 10}>
        <MediaImage
          className={clsx(
            className,
            "h-full w-full rounded-xl shadow-md transition-shadow object-cover"
          )}
          simpleImage={simpleImage}
          mediaImage={mediaImage}
          width={width}
          height={height}
          placeholder={placeholder}
          sizes="100vw"
          priority={priority}
        />
      </AspectRatio>
    ) : (
      <div className="bg-slate-50" style={{ paddingTop: "100%" }} />
    );

  return <div className="relative aspect-video">{image}</div>;
};

export default CoverImage;
