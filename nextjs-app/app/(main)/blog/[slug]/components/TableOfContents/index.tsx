"use client";
import React from "react";
import { useTableOfContents } from "./hooks";
import clsx from "clsx";
import { Headings } from "@/app/(main)/blog/[slug]/utils";

interface TableOfContentsProps {
  headings: Headings;
}

export const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const { activeId, handleScroll } = useTableOfContents(headings);

  return (
    <aside className="flex-col gap-5 lg:flex">
      <span className="text-color-primary text-sm font-bold">
        Na tej stronie
      </span>
      <nav className="flex flex-col gap-3">
        {Object.keys(headings ?? []).map((item) => (
          <a
            key={headings?.[item].id}
            onClick={() => handleScroll(headings[item].id)}
            className={clsx(
              "relative w-fit inline-block text-sm text-muted-foreground transition-colors cursor-pointer hover:text-color-primary group"
            )}
          >
            {headings[item].title}
            <span
              className={clsx(
                "absolute left-0 -bottom-0.5 h-[.0625rem] bg-current transition-transform origin-left w-full",
                {
                  "scale-x-100": headings[item].id === activeId,
                  "scale-x-0 group-hover:scale-x-100":
                    headings[item].id !== activeId,
                }
              )}
            />
          </a>
        ))}
      </nav>
    </aside>
  );
};
