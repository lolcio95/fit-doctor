"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MediaImage } from "@/app/components/atoms/MediaImage";
import { BaseImageProps } from "@/app/components/atoms/BaseImage/types";
import { LabeledLinkType } from "@/app/components/atoms/BaseLink";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { useSession, signOut } from "next-auth/react";
import { HamburgerButton } from "@/app/components/atoms/HamburgerButton";
import NextImage from "next/image";
import { Loader2, ChevronDown } from "lucide-react";
import clsx from "clsx";
import imagePlaceholder from "@/public/assets/user-img-placeholder.jpg";

type NavLink = (LabeledLinkType & { _key: string }) | null;

interface NavigationProps {
  menuItems: NavLink[];
  logo?: BaseImageProps;
}

export function Navigation({ logo, menuItems }: NavigationProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleUserClick = () => {
    setIsUserDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!isUserDropdownOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isUserDropdownOpen]);

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
            <div ref={panelRef} className="w-[270px] select-none">
              {status === "authenticated" && session?.user ? (
                <div
                  className="flex items-center cursor-pointer relative justify-end"
                  onClick={handleUserClick}
                >
                  <p className="font-bold">{session.user.name}</p>
                  <NextImage
                    className="mx-2 rounded-full w-10 h-10 object-cover"
                    src={session.user.image || imagePlaceholder}
                    alt={session.user.name || "User Image"}
                    width={40}
                    height={40}
                    placeholder="empty"
                    priority
                  />
                  <ChevronDown
                    className={clsx("text-color-tertiary", {
                      "rotate-180": isUserDropdownOpen,
                    })}
                  />
                  {isUserDropdownOpen && (
                    <div className="w-full max-w-xs bg-background-card border border-background-card/50 rounded-lg shadow-xl absolute bottom-0 left-0 translate-y-[calc(100%+10px)] z-50 overflow-hidden">
                      {/* header with avatar */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <NextImage
                          src={session.user.image || imagePlaceholder}
                          alt={session.user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          placeholder="empty"
                          priority
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-color-primary truncate">
                            {session.user.name}
                          </div>
                          {session.user.email && (
                            <div className="text-xs text-color-tertiary truncate">
                              {session.user.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-background-primary/20">
                        <div className="flex flex-col p-2 gap-2">
                          <Link
                            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-color-tertiary hover:text-background-secondary hover:bg-color-tertiary transition"
                            href="/user"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Panel użytkownika
                          </Link>

                          <button
                            onClick={() => {
                              signOut();
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-color-tertiary transition"
                          >
                            Wyloguj
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : status === "loading" ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="animate-spin text-color-tertiary" />
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <ButtonLink
                    variant="default"
                    className="ml-6"
                    text="Rejestracja"
                    href={"/registration"}
                  />
                  <ButtonLink
                    variant="outline"
                    className="ml-6"
                    text="Logowanie"
                    href={"/login"}
                  />
                </div>
              )}
            </div>
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
                {status === "authenticated" && session?.user ? (
                  <div className="flex flex-col items-center gap-4 mt-3">
                    <NextImage
                      className="mx-2 rounded-full w-10 h-10 object-cover"
                      src={session.user.image || imagePlaceholder}
                      alt={session.user.name || "User Image"}
                      width={40}
                      height={40}
                      placeholder="empty"
                      priority
                    />
                    <p className="font-bold">{session.user.name}</p>
                    <ButtonLink
                      variant="default"
                      className="w-full max-w-[12.5rem]"
                      text="Panel użytkownika"
                      href={"/user"}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    />
                    <Button
                      variant="outline"
                      className="w-full max-w-[12.5rem]"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      Wyloguj
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 mt-3">
                    <ButtonLink
                      variant="default"
                      className="w-full max-w-[12.5rem]"
                      text="Rejestracja"
                      href={"/registration"}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    />
                    <ButtonLink
                      variant="outline"
                      className="w-full max-w-[12.5rem]"
                      text="Logowanie"
                      href={"/login"}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
