import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheckBig } from "lucide-react";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { TabbedListSectionProps } from "@/app/components/organisms/TabbedList";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import { checkIfIsLight, getSecondaryTextColor } from "@/utils/colors";
import clsx from "clsx";

interface FeatureTabsSectionProps
  extends Omit<TabbedListSectionProps, "_type"> {}

export function FeatureTabsSection({
  tabs,
  backgroundColor,
}: FeatureTabsSectionProps) {
  const secondaryTextColorClassName = getSecondaryTextColor(
    backgroundColor?.label
  );

  const isLight = backgroundColor?.label
    ? checkIfIsLight(backgroundColor.label)
    : true;

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-background"
    >
      <div className="relative container mx-auto px-6">
        <Tabs
          defaultValue={tabs?.[0]._key}
          className="relative flex w-full flex-col items-start gap-8 lg:flex-row lg:gap-16"
        >
          <TabsList className="flex h-auto w-full flex-col lg:max-w-sm">
            {tabs?.map((tab) => (
              <TabsTrigger
                key={tab._key}
                value={tab._key}
                className={clsx(
                  "flex w-full items-center justify-start gap-3 p-2 text-base font-semibold md:p-4 transition-all duration-200",
                  {
                    "hover-never:bg-foreground/10 hover-never:data-[state=active]:bg-primary/80":
                      isLight,
                    "hover-never:bg-white/10": !isLight,
                  }
                )}
              >
                <MediaImage
                  simpleImage={tab.tabIcon}
                  width={16}
                  height={16}
                  asSvg
                  className="w-4 h-4"
                />
                {tab.tabTitle}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs?.map((tab) => (
            <TabsContent key={tab._key} value={tab._key} className="mt-0">
              <div className="md:bg-muted/50 space-y-8 p-0 md:rounded-2xl md:p-12">
                <h2 className="text-2xl font-bold">{tab.tabTitle}</h2>
                <div className="space-y-8">
                  {tab?.list?.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <CircleCheckBig className="text-primary h-6 w-6 flex-shrink-0" />
                      <div className="space-y-3">
                        <h3
                          className={clsx(
                            secondaryTextColorClassName,
                            "leading-6 font-bold"
                          )}
                        >
                          {feature.itemTitle}
                        </h3>
                        <p>{feature.itemDescription}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SectionWrapper>
  );
}
