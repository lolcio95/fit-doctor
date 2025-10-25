"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/public/assets/logo.svg";
import { HamburgerButton } from "@/app/components/atoms/HamburgerButton";

const navItems = [
  { href: "/user", label: "Panel użytkownika" },
  {
    label: "Siłownia",
    key: "gym",
    href: "/user/gym",
    children: [
      { href: "/user/gym/exercises", label: "Ćwiczenia" },
      { href: "/user/gym/trainings", label: "Treningi" },
      { href: "/user/gym/progress", label: "Progres" },
    ],
  },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // nowy ref - obejmuje DOM element zawierający HamburgerButton
  const toggleRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // close when clicking outside panel (mobile)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!mobileOpen) return;

      // jeśli kliknięto w panel => nic
      if (panelRef.current && panelRef.current.contains(e.target as Node)) {
        return;
      }
      // jeśli kliknięto w toggle (hamburger) => nic, bo on sam przełącza stan
      if (toggleRef.current && toggleRef.current.contains(e.target as Node)) {
        return;
      }

      // w przeciwnym razie zamykamy panel
      setMobileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  const handleNavClickOnMobile = () => {
    if (mobileOpen) setMobileOpen(false);
  };

  // helper: prefix-check for parent items (should highlight parent when on its children)
  const isPrefixActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const SidebarContent = (
    <ul className="m-0 p-0" style={{ listStyle: "none" }}>
      {navItems.map((item) => {
        if ("children" in item) {
          return (
            <li key={item.key} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Link
                  href={item.href ?? "/user/gym"}
                  onClick={handleNavClickOnMobile}
                  className={`block text-left w-full px-2 py-1 rounded-md ${
                    isPrefixActive(item.href)
                      ? "bg-color-primary text-background-primary font-semibold"
                      : "text-color-primary"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              </div>

              {/* children always expanded; grid on larger screens */}
              <ul
                className="flex flex-col gap-2 pl-3 m-0"
                style={{ listStyle: "none" }}
              >
                {item.children?.map((child) => {
                  const active = isPrefixActive(child.href);
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={handleNavClickOnMobile}
                        className={`block w-full rounded-md px-3 py-2 text-sm transition ${
                          active
                            ? "bg-color-primary text-background-primary shadow-sm"
                            : "text-color-tertiary hover:bg-background-primary"
                        }`}
                        style={{ textDecoration: "none" }}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        }

        const active = pathname === item.href;
        return (
          <li key={item.href} className="mb-4">
            <Link
              href={item.href}
              onClick={handleNavClickOnMobile}
              className={`block w-full rounded-md px-2 py-2 ${
                active
                  ? "bg-color-primary text-background-primary font-semibold"
                  : "text-color-primary hover:bg-background-primary"
              }`}
              style={{ textDecoration: "none" }}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* mobile hamburger (visible < lg) */}
      {/* owijamy HamburgerButton w div z refem toggleRef */}
      <div ref={toggleRef} className="lg:hidden fixed top-4 right-4 z-50">
        <HamburgerButton isOpen={mobileOpen} setIsOpen={setMobileOpen} />
      </div>

      <div className="lg:hidden h-12" aria-hidden />

      {/* mobile slide-over panel */}
      <div
        aria-hidden={!mobileOpen}
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          ref={panelRef}
          className={`absolute left-0 top-0 h-full w-58 bg-background-card px-4 pt-6 shadow-lg transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Sidebar"
        >
          <div className="w-full flex justify-center pb-6">
            <Link href="/">
              <NextImage
                src={Logo}
                alt="fit doctor logo"
                width={140}
                height={48}
                placeholder="empty"
                priority
              />
            </Link>
          </div>
          {SidebarContent}
        </aside>
      </div>

      {/* desktop sidebar */}
      <nav
        className="hidden lg:block bg-background-card"
        style={{
          width: "220px",
          padding: ".9375rem 1rem",
          minHeight: "100vh",
        }}
        aria-label="Sidebar"
      >
        <div className="w-full flex justify-center pb-6">
          <Link href="/">
            <NextImage
              src={Logo}
              alt="fit doctor logo"
              width={140}
              height={48}
              placeholder="empty"
              priority
            />
          </Link>
        </div>
        {SidebarContent}
      </nav>
    </>
  );
}
