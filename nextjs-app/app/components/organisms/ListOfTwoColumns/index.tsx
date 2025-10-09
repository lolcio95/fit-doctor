import { ListOfTwoColumnsFeature } from "@/components/blocks/list-of-two-columns-feature";
import { ListOfTwoColumns as SanityListOfTwoColumns } from "@/sanity.types";
import React from "react";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { BaseMediaImageProps } from "@/app/components/atoms/BaseImage/types";

export type ListOfTwoColumnsSectionProps = Omit<
  SanityListOfTwoColumns,
  "list"
> & {
  list?: (Omit<
    NonNullable<SanityListOfTwoColumns["list"]>[number],
    "button" | "image"
  > & {
    button?: LabeledLinkType;
    image?: BaseMediaImageProps;
  })[];
};

export interface ListOfTwoColumnsProps {
  block: ListOfTwoColumnsSectionProps;
}

export const ListOfTwoColumns = ({ block }: ListOfTwoColumnsProps) => {
  return <ListOfTwoColumnsFeature {...block} />;
};
