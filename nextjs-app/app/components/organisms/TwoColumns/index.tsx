import { TwoColumns as TwoColumnsSanity } from "@/sanity.types";
import { FeatureSection2 } from "@/components/blocks/feature-section-2";
import { BaseMediaImageProps } from "@/app/components/atoms/BaseImage/types";

export interface TwoColumnsSectionProps
  extends Omit<TwoColumnsSanity, "_type" | "image"> {
  image: BaseMediaImageProps;
}

export interface TwoColumnsProps {
  block: TwoColumnsSectionProps;
}

export const TwoColumns = ({ block }: TwoColumnsProps) => {
  const { image, imagePosition, text, backgroundColor } = block;

  return (
    <FeatureSection2
      text={text}
      image={image}
      imagePosition={imagePosition}
      backgroundColor={backgroundColor}
    />
  );
};
