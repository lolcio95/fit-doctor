"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { useSession, signOut } from "next-auth/react";

type NavLink = (LabeledLinkType & { _key: string }) | null;

interface NavigationProps {
  menuItems: NavLink[];
  logo?: BaseImageProps;
}

export function Navigation({ logo, menuItems }: NavigationProps) {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-background sticky top-0 isolate z-50 py-3.5 lg:py-4">
      <div className="relative container m-auto flex flex-col gap-4 px-6 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            {/* <div className="w-10 h-10"> */}
            <MediaImage
              simpleImage={logo}
              width={200}
              height={56}
              placeholder="empty"
              priority
              // asSvg
            />
            {/* </div> */}
          </Link>
          {menuItems && menuItems.length > 0 && (
            <div className="flex items-center gap-6 ml-auto">
              {menuItems.map(
                (item) =>
                  item?.label && (
                    <ButtonLink
                      key={item._key}
                      text={item.label}
                      href={item.resource?.slug ?? "/"}
                    />
                  )
              )}
            </div>
          )}
          {status === "authenticated" ? (
            <Button
              variant="outline"
              className="ml-6"
              onClick={() => signOut()}
            >
              Wyloguj
            </Button>
          ) : (
            <ButtonLink
              variant="outline"
              className="ml-6"
              text="Zaloguj"
              href={"/login"}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
