import { MediaImage } from "@/app/components/atoms/MediaImage";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { BigImageSectionProps } from "@/app/components/organisms/BigImage";

interface TeamImageSectionProps extends Omit<BigImageSectionProps, "_type"> {}

export function TeamImageSection({
  image,
  title,
  backgroundColor,
}: TeamImageSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-slate-50"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto flex flex-col items-center gap-8 px-6 md:gap-12">
        <h2 className="text-center text-3xl font-bold md:text-4xl">{title}</h2>
        <MediaImage
          mediaImage={image}
          className="aspect-[16/10] w-full rounded-lg object-cover"
        />
      </div>
    </SectionWrapper>
  );
}
