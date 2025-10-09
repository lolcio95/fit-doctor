import { MediaImage } from "@/app/components/atoms/MediaImage";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { IconHighlightsSectionProps } from "@/app/components/organisms/IconHighlights";

interface ValuesSectionProps
  extends Omit<IconHighlightsSectionProps, "_type"> {}

export function ValuesSection({
  highlights,
  title,
  backgroundColor,
}: ValuesSectionProps) {
  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-background"
    >
      <div className="container mx-auto flex flex-col gap-12 px-6 md:gap-16">
        {title && (
          <div className="mx-auto flex max-w-xl flex-col gap-4 text-center md:gap-5">
            <PortableText value={title} />
          </div>
        )}
        {!!highlights?.length && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-3">
            {highlights.map(({ _key, description, icon, title }) => (
              <div
                className="flex flex-col items-center gap-5 text-center"
                key={_key}
              >
                <div className="bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-md border shadow-xs">
                  {icon && icon.image && (
                    <MediaImage
                      simpleImage={icon}
                      className="rounded-md h-5 w-5 object-contain"
                      width={20}
                      height={20}
                      placeholder="empty"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">{title}</h3>
                  <PortableText value={description} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
