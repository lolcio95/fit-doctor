import { PortableTextBlock, PortableTextComponentProps } from "next-sanity";
import type {
  PortableTextMarkDefinition,
  PortableTextSpan,
  ArbitraryTypedObject,
} from "@portabletext/types";
import React from "react";

export type Headings = Record<string, { id: string; title: string }>;

type Children = PortableTextComponentProps<
  PortableTextBlock<
    PortableTextMarkDefinition,
    ArbitraryTypedObject | PortableTextSpan,
    string,
    string
  >
>["children"];

export const getContent = (
  children: Children,
  removeHardBreaks?: boolean
): React.ReactNode => {
  const hasChildren =
    Array.isArray(children) && children.some((item) => item !== "");

  if (hasChildren) {
    return children;
  }

  if (removeHardBreaks) {
    return null;
  }

  return <>&nbsp;</>;
};

export const getChildrenText = (children: Children) => {
  if (typeof React.Children.toArray(children)[0] === "string") {
    return null;
  }
  const childArray = React.Children.toArray(children);
  const firstChild = childArray[0];
  if (React.isValidElement(firstChild)) {
    return firstChild.props.children?.[0];
  } else {
    return firstChild.toString();
  }
};
