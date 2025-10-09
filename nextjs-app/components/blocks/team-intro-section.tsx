import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { TeamIntroSectionProps as TeamIntroSectionComponentProps } from "@/app/components/organisms/TeamIcons";
import { getSecondaryTextColor } from "@/utils/colors";
import clsx from "clsx";

interface TeamIntroSectionProps
  extends Omit<TeamIntroSectionComponentProps, "_type"> {}

export function TeamIntroSection({
  title,
  button,
  teamIcons,
  backgroundColor,
}: TeamIntroSectionProps) {
  const secondaryTextColorClassName = getSecondaryTextColor(
    backgroundColor?.label
  );

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-background"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6">
            <div className="flex max-w-xl flex-col items-center gap-4 text-center">
              <PortableText value={title} />
            </div>
            {button?.label && <ButtonLink variant="outline" link={button} />}
          </div>

          <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
            {teamIcons?.map((member, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center gap-4 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  {member.person?.picture && (
                    <MediaImage
                      simpleImage={member.person?.picture}
                      height={64}
                      width={64}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    <p
                      className={clsx(
                        secondaryTextColorClassName,
                        "text-base font-semibold"
                      )}
                    >
                      {member.person?.firstName} {member.person?.lastName}
                    </p>
                    <p className="text-base">{member.person?.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
