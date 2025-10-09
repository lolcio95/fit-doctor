"use client";
import React, { PropsWithChildren, useCallback, useState } from "react";
import NextLink, { LinkProps } from "next/link";
import { LabeledLink, Link as SanityLink } from "@/sanity.types";
import { downloadFile, getHref } from "./helpers";

export type Link = {
  resource: { slug: string | null } | null;
  mediaLink: {
    asset: { url: string | null; originalFilename: string | null } | null;
  } | null;
  section: { page: { slug: string | null }; sectionKey: string | null } | null;
} & Omit<SanityLink, "resource" | "mediaLink" | "section" | "_type">;

export type LabeledLinkType = Omit<
  LabeledLink,
  "_type" | "resource" | "mediaLink" | "section"
> & {
  resource: { slug: string | null } | null;
  section: { page: { slug: string | null }; sectionKey: string | null } | null;
  mediaLink: {
    asset: { url: string | null; originalFilename: string | null } | null;
  } | null;
};

export interface BaseLinkProps extends Partial<LinkProps> {
  link?: LabeledLinkType;
  className?: string;
}

export const BaseLink = ({
  link,
  children,
  className,
  ...props
}: PropsWithChildren<BaseLinkProps>) => {
  const { href } = props;
  const [active, setActive] = useState(false);

  return (
    <NextLink
      {...props}
      prefetch={active}
      onMouseOver={() => setActive(true)}
      className={className}
      href={href ?? getHref(link)}
      download={link?.type === "mediaLink" && link.downloadType === "download"}
      target={
        link?.type === "externalUrl" ||
        (link?.type === "mediaLink" && link?.downloadType === "openInNewTab")
          ? "_blank"
          : "_self"
      }
      onClick={() => {
        if (link?.mediaLink && link.downloadType === "download") {
          downloadFile(
            link?.mediaLink?.asset?.url ?? "",
            link.mediaLink.asset?.originalFilename ?? ""
          );
        }
      }}
    >
      {children}
    </NextLink>
  );
};
