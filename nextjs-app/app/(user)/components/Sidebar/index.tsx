import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HamburgerButton } from "@/app/components/atoms/HamburgerButton";

const navItems = [
  { href: "/user", label: "Dashboard" },
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
  { href: "/user/settings", label: "Ustawienia" },
];

export default function Sidebar() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const toggle = (key?: string) => {
    if (!key) return;
    console.log("toggling", key);
    setOpenKey((prev) => (prev === key ? null : key));
  };

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
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  // helper: when user clicks a nav link on mobile, close the slide-over
  const handleNavClickOnMobile = () => {
    if (mobileOpen) setMobileOpen(false);
  };

  const SidebarContent = (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {navItems.map((item) => {
        if ("children" in item) {
          const isOpen = openKey === item.key;
          return (
            <li key={item.key} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link
                  href={item.href ?? "/user/gym"}
                  onClick={handleNavClickOnMobile}
                  className="text-color-primary font-bold"
                  style={{
                    textDecoration: "none",
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "left",
                    padding: "8px 0",
                    display: "block",
                  }}
                >
                  {item.label}
                </Link>
                <button
                  onClick={() => toggle(item.key)}
                  aria-expanded={isOpen}
                  aria-label={`${item.label} toggle`}
                  className="text-color-primary font-bold"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px",
                    opacity: 0.8,
                  }}
                >
                  <span>{isOpen ? "▾" : "▸"}</span>
                </button>
              </div>
              {isOpen && (
                <ul
                  style={{
                    listStyle: "none",
                    padding: "8px 0 0 12px",
                    margin: 0,
                  }}
                >
                  {item.children.map((child) => (
                    <li key={child.href} style={{ marginBottom: 12 }}>
                      <Link
                        href={child.href}
                        onClick={handleNavClickOnMobile}
                        className="text-color-tertiary"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        }

        return (
          <li key={item.href} style={{ marginBottom: 16 }}>
            <Link
              href={item.href}
              onClick={handleNavClickOnMobile}
              className="text-color-primary font-bold"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
              }}
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
      {/* mobile hamburger (visible < lg) - fixed for easy reach */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <HamburgerButton
          isOpen={mobileOpen}
          setIsOpen={() => setMobileOpen(!mobileOpen)}
        />
      </div>

      {/* spacer so page content is pushed below the fixed hamburger on mobile */}
      <div className="lg:hidden h-12" aria-hidden />

      {/* mobile slide-over panel */}
      <div
        aria-hidden={!mobileOpen}
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* panel */}
        <aside
          ref={panelRef}
          className={`absolute left-0 top-0 h-full w-64 bg-background-card px-6 pt-8 shadow-lg transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Sidebar"
        >
          {SidebarContent}
        </aside>
      </div>

      {/* desktop sidebar (visible >= lg) */}
      <nav
        className="hidden lg:block bg-background-card"
        style={{
          width: "220px",
          padding: "2rem 1rem",
          minHeight: "100vh",
        }}
        aria-label="Sidebar"
      >
        {SidebarContent}
      </nav>
    </>
  );
}
