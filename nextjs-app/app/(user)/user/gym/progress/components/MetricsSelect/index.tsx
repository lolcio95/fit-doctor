"use client";
import React, { useEffect, useRef, useState } from "react";

const OPTIONS: { value: "max" | "avg" | "last" | "volume"; label: string }[] = [
  { value: "max", label: "Najcięższa seria (max)" },
  { value: "avg", label: "Średnia (avg)" },
  { value: "last", label: "Ostatnia seria (last)" },
  { value: "volume", label: "Objętość (volume)" },
];

export default function MetricSelect({
  value,
  onChange,
}: {
  value: "max" | "avg" | "last" | "volume";
  onChange: (v: "max" | "avg" | "last" | "volume") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 640 : false;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = (v: (typeof OPTIONS)[number]["value"]) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="px-3 py-2 rounded-lg border bg-transparent inline-flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="text-sm">
          {OPTIONS.find((o) => o.value === value)?.label}
        </span>
        <svg
          className="w-4 h-4 opacity-70"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 011.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <>
          {/* desktop dropdown */}
          {!isMobile ? (
            <div className="absolute mt-2 right-0 w-64 bg-background-card rounded-lg shadow-lg border z-50">
              <ul className="p-2">
                {OPTIONS.map((o) => (
                  <li key={o.value}>
                    <button
                      onClick={() => handleSelect(o.value)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-background-primary ${
                        o.value === value
                          ? "bg-background-primary/40 font-medium"
                          : ""
                      }`}
                    >
                      {o.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            /* mobile full-width bottom sheet */
            <div className="fixed inset-0 z-50 flex items-end sm:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpen(false)}
              />
              <div className="relative w-full bg-background-card rounded-t-2xl p-4 border-t shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-semibold">Wybierz metrykę</div>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-2 py-1 rounded hover:bg-background-primary"
                  >
                    Zamknij
                  </button>
                </div>
                <div className="space-y-2">
                  {OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => handleSelect(o.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm border ${
                        o.value === value
                          ? "bg-color-primary text-background-primary border-color-primary"
                          : "bg-transparent"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
