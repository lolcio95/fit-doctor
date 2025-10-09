import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MainHeroSectionProps } from "@/app/components/organisms/MainHero";
import { PortableText } from "@/app/components/atoms/PortableText";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface HeroVideoSection extends Omit<MainHeroSectionProps, "_type"> {}

export function HeroVideoSection({
  title,
  description,
  buttons,
  type,
  videoId,
  image,
  backgroundColor,
}: HeroVideoSection) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-muted"
    >
      <div className="container mx-auto flex flex-col items-center gap-12 px-6 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-6 lg:gap-8">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <PortableText value={title} />
            <PortableText value={description} />
          </div>

          <div className="flex flex-col items-start gap-3 md:flex-row">
            {buttons?.map(({ _key, link, type }) => {
              if (!link?.label) {
                return null;
              }

              return (
                <ButtonLink
                  key={_key}
                  className="w-full"
                  linkClassName="w-full md:w-auto"
                  link={link}
                  variant={type === "fill" ? "default" : "ghost"}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full flex-1">
          <AspectRatio ratio={4 / 3}>
            {type === "video" ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full rounded-lg object-cover"
              ></iframe>
            ) : (
              <MediaImage
                mediaImage={image}
                className="h-full w-full rounded-lg object-cover"
                placeholder="empty"
                priority
              />
            )}
          </AspectRatio>
        </div>
      </div>
    </SectionWrapper>
  );
}
