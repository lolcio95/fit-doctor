import { FeatureTabsSection } from "@/components/blocks/feature-tabs-section";
import { TabbedList as SanityTabbedList } from "@/sanity.types";
import React from "react";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";

export interface TabbedListSectionProps extends Omit<SanityTabbedList, "tabs"> {
  tabs?: (Omit<NonNullable<SanityTabbedList["tabs"]>[number], "tabIcon"> & {
    tabIcon: BaseImageProps;
  })[];
}

export interface TabbedListProps {
  block: TabbedListSectionProps;
}

export const TabbedList = ({ block }: TabbedListProps) => {
  const { tabs, backgroundColor } = block;

  return <FeatureTabsSection tabs={tabs} backgroundColor={backgroundColor} />;
};
