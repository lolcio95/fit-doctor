"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, FC } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { GetNavbarQueryResult } from "@/sanity.types";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import useToggle from "@/hooks/useToggle";
import { usePathname } from "next/navigation";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";
import clsx from "clsx";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";

type MenuButtons = NonNullable<GetNavbarQueryResult>["buttons"] | undefined;
type MenuItems = NonNullable<GetNavbarQueryResult>["menuItems"] | undefined;

type RawMenuItem =
  NonNullable<GetNavbarQueryResult>["menuItems"] extends Array<infer T>
    ? T
    : never;

type SubmenuItem =
  RawMenuItem["submenu"] extends Array<infer SubT>
    ? Omit<SubT, "link"> & { link: LabeledLinkType } & { _key: string }
    : never;

type MenuLink = (LabeledLinkType & { _key: string }) | null;
type Submenu = Array<SubmenuItem> | null;

type NavbarItemProps = Omit<
  NonNullable<MenuItems>[number],
  "_key" | "link" | "submenu"
> & {
  link: MenuLink;
  submenu: Submenu;
};

interface NavbarProps {
  buttons: MenuButtons;
  menuItems: MenuItems;
  logo?: BaseImageProps;
}

interface NavMenuItemsProps {
  menuItems: MenuItems;
  className?: string;
}

const NavMenuItem: FC<NavbarItemProps> = ({
  link,
  submenu,
  hasSubmenu,
  title,
}) => {
  const pathname = usePathname();
  const [isDropdownOpen, { toggle, registerContainerRef }] = useToggle();

  const isActive =
    link?.resource?.slug &&
    pathname === `${link.resource.slug}` &&
    pathname !== "/";

  const isSubmenuActive = submenu?.some(
    ({ link: submenuLink }) =>
      submenuLink?.resource?.slug && pathname === `${submenuLink.resource.slug}`
  );

  const isCurrent = isActive || isSubmenuActive;

  return (
    <div className="relative" ref={registerContainerRef}>
      {hasSubmenu && !!submenu?.length ? (
        <div className="w-full">
          <Button
            variant="ghost"
            className={clsx("w-full justify-between px-2 lg:w-auto", {
              "bg-muted": isCurrent,
            })}
            onClick={toggle}
          >
            {title}
            <ChevronDown
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          {isDropdownOpen && (
            <div className="bg-background w-full rounded-md p-2 duration-200 lg:absolute lg:top-full lg:min-w-[260px] lg:shadow-lg">
              {submenu.map(({ _key, link: submenuLink }) => {
                if (!submenuLink?.label || !submenuLink?.resource?.slug)
                  return null;

                const isSubActive =
                  pathname === `${submenuLink.resource?.slug}`;

                return (
                  <ButtonLink
                    key={_key}
                    link={submenuLink}
                    variant="ghost"
                    className={clsx("w-full justify-start", {
                      "bg-muted": isSubActive,
                    })}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {link?.label && link?.resource?.slug && (
            <ButtonLink
              link={link}
              variant="ghost"
              className={clsx(
                pathname === `${link.resource.slug}` && "bg-muted"
              )}
            />
          )}
        </>
      )}
    </div>
  );
};

const NavMenuItems = ({ menuItems, className }: NavMenuItemsProps) => {
  return (
    <div className={`-mx-2 flex flex-col gap-1 lg:flex-row ${className ?? ""}`}>
      {menuItems?.map(({ title, hasSubmenu, submenu, _key, link }) => (
        <NavMenuItem
          key={_key}
          title={title}
          hasSubmenu={hasSubmenu}
          submenu={submenu as Submenu}
          link={link as MenuLink}
        />
      ))}
    </div>
  );
};

export function Navbar({ logo, menuItems, buttons }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    handleRouteChange();
  }, [pathname]);

  const renderActionButtons = (className?: string) => (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {buttons &&
        buttons.map(
          ({ _key, link, type }) =>
            link?.label && (
              <ButtonLink
                key={_key}
                //@ts-ignore
                link={link}
                variant={type === "fill" ? "default" : "outline"}
                className="w-full lg:w-auto"
              />
            )
        )}
    </div>
  );

  return (
    <nav className="bg-background sticky top-0 isolate z-50 py-3.5 lg:py-4">
      <div className="relative container m-auto flex flex-col justify-between gap-4 px-6 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex justify-between">
          <Link href="/">
            <MediaImage
              simpleImage={logo}
              width={150}
              height={36}
              placeholder="empty"
              priority
            />
          </Link>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-9 items-center justify-center lg:hidden"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex h-full flex-col justify-between px-6 pt-12 pb-6">
                <div className="flex flex-col gap-5">
                  <NavMenuItems className="flex-col" menuItems={menuItems} />
                </div>
                {buttons && buttons.length > 0 && (
                  <div className="mt-auto flex flex-col gap-2">
                    {renderActionButtons(
                      "w-full flex flex-col gap-2 items-stretch"
                    )}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden w-full flex-row justify-end gap-5 lg:flex">
          <NavMenuItems menuItems={menuItems} />
          {buttons && buttons.length > 0 && renderActionButtons()}
        </div>
      </div>
    </nav>
  );
}
