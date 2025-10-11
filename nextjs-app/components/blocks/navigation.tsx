"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { useSession, signOut } from "next-auth/react";
import { HamburgerButton } from "@/app/components/atoms/HamburgerButton";

type NavLink = (LabeledLinkType & { _key: string }) | null;

interface NavigationProps {
  menuItems: NavLink[];
  logo?: BaseImageProps;
}

export function Navigation({ logo, menuItems }: NavigationProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background-secondary sticky top-0 isolate z-50 py-0 lg:py-0 h-14 lg:h-20 flex justify-center items-center">
      <div className="relative container m-auto flex flex-col gap-4 px-6 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center justify-between w-full">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <MediaImage
              className="z-10 relative"
              simpleImage={logo}
              width={150}
              height={56}
              placeholder="empty"
              priority
            />
          </Link>
          <div className="hidden lg:flex lg:items-center lg:gap-6 lg:flex-1">
            {menuItems && menuItems.length > 0 && (
              <div className="flex items-center gap-6 ml-auto">
                {menuItems.map(
                  (item) =>
                    item?.label && (
                      <ButtonLink
                        variant={"link"}
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
          <div className="lg:hidden">
            <div className="z-10 relative">
              <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
            <div
              className={`absolute top-0 left-0 w-full pt-12 bg-background-secondary transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
            >
              <div className="flex flex-col items-center justify-center py-4">
                {menuItems && menuItems.length > 0 && (
                  <div className="flex flex-col items-center gap-4">
                    {menuItems.map(
                      (item) =>
                        item?.label && (
                          <ButtonLink
                            variant={"link"}
                            key={item._key}
                            text={item.label}
                            href={item.resource?.slug ?? "/"}
                            onClick={() => setIsOpen(false)}
                          />
                        )
                    )}
                  </div>
                )}
                {status === "authenticated" ? (
                  <Button
                    variant="outline"
                    className="6"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    Wyloguj
                  </Button>
                ) : (
                  <ButtonLink
                    variant="outline"
                    className="mt-4"
                    text="Zaloguj"
                    href={"/login"}
                    onClick={() => setIsOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
