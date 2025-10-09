import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs as SanityTabs } from "@/sanity.types";
import BlockRenderer from "@/app/components/BlockRenderer";
import { PortableText } from "@/app/components/atoms/PortableText";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";
import clsx from "clsx";
import { checkIfIsLight } from "@/utils/colors";

interface FeatureTabsSection2Props extends Omit<SanityTabs, "_type"> {}

export function FeatureTabsSection2({
  title,
  tabs,
  backgroundColor,
}: FeatureTabsSection2Props) {
  const isLight = backgroundColor?.label
    ? checkIfIsLight(backgroundColor.label)
    : true;

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-background"
    >
      <div className="container mx-auto flex flex-col gap-10 px-6 md:gap-12">
        <PortableText value={title} />

        <Tabs defaultValue={"0"} className="w-full">
          <TabsList className="mb-8 flex h-auto w-full flex-col gap-2 lg:mx-auto lg:w-fit lg:flex-row">
            {tabs?.map((tab, index) => (
              <TabsTrigger
                value={`${index}`}
                className={clsx(
                  "h-10 w-full rounded-full px-4 text-left font-semibold lg:w-fit",
                  {
                    "hover-never:bg-foreground/10": isLight,
                    "hover-never:bg-white/10": !isLight,
                  }
                )}
                key={tab._key}
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs?.map((tab, index) => (
            <TabsContent value={`${index}`} key={tab._key}>
              {tab.tabsSections?.map((item, index) => {
                return (
                  <BlockRenderer
                    key={index}
                    block={item}
                    pageId={item._key}
                    pageType="tab"
                  />
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SectionWrapper>
  );
}
