import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { FeaturesWithLogosSection } from "@/app/components/organisms/FeaturesWithLogos";
import { PortableText } from "@/app/components/atoms/PortableText";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { BaseLink } from "@/app/components/atoms/BaseLink";
import { FC } from "react";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { getSecondaryTextColor } from "@/utils/colors";
import clsx from "clsx";

interface FeatureSection3Props
  extends Omit<FeaturesWithLogosSection, "_type"> {}

const FeatureSection3: FC<FeatureSection3Props> = ({
  features,
  logos,
  title,
  backgroundColor,
}) => {
  const secondaryTextColorClassName = getSecondaryTextColor(
    backgroundColor?.label
  );

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      defaultBgClassName="bg-slate-50"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto flex flex-col items-center gap-10 px-6 md:gap-12">
        <PortableText value={title} />
        {!!features?.length && (
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
            {features.map(({ _key, content, link, title }) => (
              <BaseLink link={link} key={_key}>
                <Card className="w-full shadow-xs h-full">
                  <CardHeader className="relative">
                    <ExternalLink className="absolute top-0 right-6 size-4" />
                    <CardTitle
                      className={clsx(
                        secondaryTextColorClassName,
                        "text-semibold mb-2"
                      )}
                    >
                      {title}
                    </CardTitle>
                    <CardDescription className="md:min-h-10">
                      <PortableText value={content} />
                    </CardDescription>
                  </CardHeader>
                </Card>
              </BaseLink>
            ))}
          </div>
        )}
        {!!logos?.length && (
          <div className="flex gap-6 md:gap-10 flex-wrap justify-evenly w-full">
            {logos.map(({ _key, ...restLogo }) => (
              <div key={_key} className="h-12 py-2.5">
                <MediaImage
                  simpleImage={restLogo}
                  className="max-h-full object-contain max-w-[200px] h-12 object-center w-auto"
                  placeholder="empty"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default FeatureSection3;
