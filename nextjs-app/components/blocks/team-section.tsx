import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { TeamCardsSectionProps } from "@/app/components/organisms/TeamCards";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { urlForImage } from "@/sanity/lib/utils";
import { getSecondaryTextColor } from "@/utils/colors";
import clsx from "clsx";

interface TeamSectionProps extends Omit<TeamCardsSectionProps, "_type"> {}

export function TeamSection({
  cards,
  title,
  backgroundColor,
}: TeamSectionProps) {
  if (!cards?.length) {
    return null;
  }

  const secondaryTextColorClassName = getSecondaryTextColor(
    backgroundColor?.label
  );

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-background"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-12">
          <div className="flex max-w-xl flex-col gap-4">
            <PortableText value={title} />
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
            {cards.map(({ _key, description, person }) => {
              const { firstName, lastName, picture, position } = person || {};

              const memberName = [firstName, lastName]
                .filter(Boolean)
                .join(" ");

              const simpleImageSrc = picture?.image
                ? urlForImage(picture.image)
                    ?.height(400)
                    .fit("fill")
                    .width(400)
                    .url()!
                : undefined;

              return (
                <div key={_key} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <Avatar className="aspect-[4/3] h-auto w-full rounded-xl">
                      <AvatarImage
                        src={simpleImageSrc}
                        alt={memberName}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <p
                        className={clsx(
                          secondaryTextColorClassName,
                          "text-base font-bold"
                        )}
                      >
                        {memberName}
                      </p>
                      <p className="text-base">{position}</p>
                    </div>
                  </div>
                  {description && <p className="text-base">{description}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
