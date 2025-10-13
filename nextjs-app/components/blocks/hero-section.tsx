import { MainHeroSectionProps } from "@/app/components/organisms/MainHero";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";

interface HeroVideoSection extends Omit<MainHeroSectionProps, "_type"> {}

export function HeroSection({
  title,
  description,
  button,
  image,
  backgroundColor,
}: HeroVideoSection) {
  return (
    <SectionWrapper backgroundColor={backgroundColor}>
      <div className="w-full h-[100vh] max-h-[calc(100vh-56px)] lg:max-h-[calc(100vh-80px)] relative flex items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <MediaImage
            mediaImage={image}
            className="aspect-[16/9] h-full w-full object-cover"
            placeholder="empty"
            priority
          />
          <div className="w-full h-full absolute top-0 left-0 bg-black opacity-75" />
        </div>
        <div className="flex flex-col gap-6 lg:gap-8 relative z-10 justify-center items-center text-center px-4 md:px-0">
          <div className="flex flex-col gap-6 text-center">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-color-secondary">
              {title}
            </h2>
            <p className="text-md lg:text-lg font-semibold">{description}</p>
          </div>
          <ButtonLink link={button} />
        </div>
      </div>
    </SectionWrapper>
  );
}
