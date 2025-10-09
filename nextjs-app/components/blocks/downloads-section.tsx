import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { PortableText } from "@/app/components/atoms/PortableText";
import { Button } from "@/app/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Link } from "@/app/components/atoms/BaseLink";
import { HubspotForm } from "@/app/components/molecules/HubspotForm";
import { Download } from "lucide-react";
import { DownloadsSectionProps } from "@/app/components/organisms/DownloadCards";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function DownloadsSection({
  cards,
  backgroundColor,
}: DownloadsSectionProps) {
  if (!cards?.length) {
    return null;
  }

  return (
    <SectionWrapper
      defaultBgClassName="bg-background"
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map(
            ({
              _key,
              button,
              content,
              downloadViaEmail,
              image,
              title,
              downloadType,
              formId,
              media,
            }) => (
              <Dialog key={_key}>
                <Card className="flex flex-col overflow-hidden">
                  {image && (
                    <CardHeader>
                      <MediaImage
                        simpleImage={image}
                        className="aspect-[4/3] max-h-[320px] w-full rounded-md object-cover"
                      />
                    </CardHeader>
                  )}
                  <CardContent className="flex h-full flex-col gap-2">
                    {title && (
                      <h3 className="text-base leading-6 font-bold">{title}</h3>
                    )}
                    <PortableText value={content} />
                  </CardContent>
                  {button?.label && (
                    <CardFooter>
                      {downloadViaEmail ? (
                        <DialogTrigger className="w-full">
                          <Button
                            asChild
                            linkProps={{
                              label: button.label,
                            }}
                            icon={<Download />}
                            iconPlacement="left"
                            variant="outline"
                            size="sm"
                            className="w-full shadow-none"
                          />
                        </DialogTrigger>
                      ) : (
                        <ButtonLink
                          link={{
                            ...button,
                            type: "mediaLink",
                            resource: null,
                            downloadType,
                            mediaLink: media as unknown as Link["mediaLink"],
                            section: null,
                          }}
                          icon={<Download />}
                          iconPlacement="left"
                          variant="outline"
                          size="sm"
                          linkClassName="w-full"
                          className="w-full shadow-none"
                        />
                      )}
                    </CardFooter>
                  )}
                </Card>
                <DialogContent
                  aria-describedby="hubspot-form"
                  className="max-h-[calc(100vh-2rem)] overflow-y-auto"
                >
                  <VisuallyHidden>
                    <DialogTitle>Hubspot form</DialogTitle>
                  </VisuallyHidden>
                  <HubspotForm formId={formId} />
                </DialogContent>
              </Dialog>
            )
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
