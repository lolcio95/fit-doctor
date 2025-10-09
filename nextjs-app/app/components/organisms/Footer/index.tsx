import React from "react";
import { Footer as FooterBlock } from "@/components/blocks/footer";
import { sanityFetch } from "@/sanity/lib/live";
import { getFooterQuery } from "@/sanity/lib/queries";

export const Footer = async () => {
  const { data: footer } = await sanityFetch({
    query: getFooterQuery,
  });

  return (
    <FooterBlock
      footerMenuItems={footer?.footerMenuItems}
      references={footer?.references ?? []}
      logo={footer?.logo}
      socialMedia={footer?.socials ?? []}
    />
  );
};
