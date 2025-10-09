import { Stats as SanityStats } from "@/sanity.types";
import React from "react";
import { StatsSection } from "@/components/blocks/stats-section";

export interface StatsProps {
  block: SanityStats;
}

export const Stats = ({ block }: StatsProps) => {
  const { title, stats, backgroundColor } = block;

  return (
    <StatsSection
      title={title}
      stats={stats}
      backgroundColor={backgroundColor}
    />
  );
};
