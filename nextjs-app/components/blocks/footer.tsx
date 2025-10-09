"use client";

import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";
import { BaseLink, LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { PortableText } from "@/app/components/atoms/PortableText";
import { GetFooterQueryResult, SocialMedia } from "@/sanity.types";
import Link from "next/link";

type FooterQueryResult = NonNullable<GetFooterQueryResult>;
type FooterMenuItemsQueryResult = NonNullable<
  FooterQueryResult["footerMenuItems"]
>;
type ReferencesQueryResult = NonNullable<FooterQueryResult["references"]>;

type FooterMenuItems = (Omit<FooterMenuItemsQueryResult[number], "submenu"> & {
  submenu?: (Omit<
    NonNullable<FooterMenuItemsQueryResult[number]["submenu"]>[number],
    "link"
  > & {
    link: LabeledLinkType | null; // Assuming this is a PortableText type
  })[];
})[];
type References = (Omit<ReferencesQueryResult[number], "link"> & {
  link: LabeledLinkType | null; // Assuming this is a PortableText type
})[];
type Socials = (Pick<SocialMedia, "name" | "socialsUrl"> & {
  image?: BaseImageProps;
})[];

interface FooterProps {
  footerMenuItems?: FooterMenuItems;
  references?: References;
  logo?: BaseImageProps;
  socialMedia: Socials;
}

export function Footer({
  footerMenuItems,
  references,
  logo,
  socialMedia,
}: FooterProps) {
  return (
    <footer
      className="bg-footer py-16 text-white lg:py-24"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto flex flex-col gap-12 px-6 lg:gap-24">
        {!!footerMenuItems?.length && (
          <div className="grid grid-cols-1 items-center gap-12 text-center lg:grid-cols-6 lg:items-start lg:gap-6 lg:text-left">
            {footerMenuItems.map((column) => (
              <div key={column._key} className="flex flex-col gap-4">
                <h2 className="text-base font-bold text-white">
                  {column.title}
                </h2>
                {!!column.submenu?.length && (
                  <nav
                    className="flex flex-col gap-3"
                    aria-label={`${column.title} links`}
                  >
                    {column.submenu.map((submenuItem) => {
                      const { _key, type } = submenuItem;

                      if (type === "textContent") {
                        const { textContent } = submenuItem;

                        return (
                          <div
                            key={_key}
                            className="text-secondary-foreground-muted text-base font-medium transition-colors whitespace-pre-line"
                          >
                            <PortableText
                              value={textContent}
                              className="[&_a]:font-medium [&_a]:no-underline [&_a:hover]:opacity-100 [&_a:hover]:text-white"
                            />
                          </div>
                        );
                      }

                      if (type === "link") {
                        const { link } = submenuItem;

                        if (!link?.label) {
                          return null;
                        }

                        return (
                          <BaseLink
                            key={_key}
                            link={link}
                            className="text-secondary-foreground-muted text-base font-medium transition-colors hover:text-white whitespace-pre-line"
                          >
                            {link.label}
                          </BaseLink>
                        );
                      }

                      return null;
                    })}
                  </nav>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="relative flex flex-col gap-12 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <Link href="/" className="order-1 lg:order-1 flex justify-center">
            <MediaImage simpleImage={logo} width={133} height={32} />
          </Link>

          {!!references?.length && (
            <nav
              className="order-2 flex flex-col items-center gap-6 text-center lg:absolute lg:top-1/2 lg:left-1/2 lg:order-2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex-row lg:items-start lg:gap-8 lg:text-left"
              aria-label="Legal links"
            >
              {references.map(({ _key, link }) => {
                if (!link?.label) {
                  return null;
                }

                return (
                  <BaseLink
                    key={_key}
                    link={link}
                    className="text-secondary-foreground-muted text-center text-sm transition-colors hover:text-white md:text-left hover:no-underline p-0 font-light"
                  >
                    {link.label}
                  </BaseLink>
                );
              })}
            </nav>
          )}
          {!!socialMedia?.length && (
            <div className="order-1 lg:order-3 flex gap-2 justify-center">
              {socialMedia.map(({ name, socialsUrl, image }) => (
                <Link
                  key={name}
                  href={socialsUrl ?? ""}
                  className="flex items-center justify-center transition-colors hover:scale-110 hover:text-white lg:order-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {image && (
                    <MediaImage
                      simpleImage={image}
                      width={24}
                      height={24}
                      placeholder="empty"
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
