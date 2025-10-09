import { Tabs as TabsSanity } from "@/sanity.types";
import React from "react";
import { FeatureTabsSection2 } from "@/components/blocks/feature-tabs-section-2";

export interface TabsProps {
  block: TabsSanity;
}

export const Tabs = ({ block }: TabsProps) => {
  const { title, tabs, backgroundColor } = block;

  return (
    <FeatureTabsSection2
      tabs={tabs}
      title={title}
      backgroundColor={backgroundColor}
    />
  );
};
