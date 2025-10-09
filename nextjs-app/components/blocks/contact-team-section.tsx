import { ContactTeamSectionProps as ComponentContactTeamSectionProps } from "@/app/components/organisms/ContactTeam";
import { PortableText } from "@/app/components/atoms/PortableText";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "@/app/components/atoms/Button";
import { CalendlyWidget } from "@/app/components/molecules/CalendlyWidget";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { getSecondaryTextColor } from "@/utils/colors";
import clsx from "clsx";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ContactTeamSectionProps
  extends Omit<ComponentContactTeamSectionProps, "_type"> {}

export function ContactTeamSection({
  advisors,
  title,
  backgroundColor,
}: ContactTeamSectionProps) {
  const secondaryTextColorClassName = getSecondaryTextColor(
    backgroundColor?.label
  );

  return (
    <SectionWrapper
      defaultBgClassName="bg-background"
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-12">
          <div className="flex max-w-xl flex-col gap-4">
            <PortableText value={title} />
          </div>
          {!!advisors?.length && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-3 lg:gap-x-6">
              {advisors.map(({ _key, advisor }) => {
                const {
                  bio,
                  button,
                  firstName,
                  languages,
                  lastName,
                  picture,
                  position,
                } = advisor || {};
                const fullName = [firstName, lastName]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Dialog key={_key}>
                    <div className="flex flex-col items-start gap-4">
                      <div className="aspect-square rounded-xl lg:aspect-[4/5] overflow-hidden w-full">
                        <MediaImage
                          simpleImage={picture}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p
                          className={clsx(
                            secondaryTextColorClassName,
                            "font-bold"
                          )}
                        >
                          {fullName}
                        </p>
                        {position && <p>{position} </p>}
                      </div>
                      <div className="flex flex-col gap-2">
                        {languages && (
                          <p className="font-semibold">{languages}</p>
                        )}
                        <PortableText value={bio} />
                      </div>
                      {button?.text && button?.calendlyUrl && (
                        <DialogTrigger className="w-full lg:w-auto">
                          <Button
                            asChild
                            linkProps={{
                              label: button.text,
                            }}
                            className="w-full lg:w-auto"
                          />
                        </DialogTrigger>
                      )}
                    </div>
                    {!!button?.calendlyUrl && (
                      <DialogContent
                        className="max-h-[calc(100vh-2rem)] overflow-y-auto"
                        aria-describedby="calendly-dialog"
                      >
                        <VisuallyHidden>
                          <DialogTitle>Calendly form</DialogTitle>
                        </VisuallyHidden>
                        <CalendlyWidget url={button.calendlyUrl} />
                      </DialogContent>
                    )}
                  </Dialog>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
