import { useState, useEffect } from "react";
import { OFFSET, AUTO_SCROLL_OFFSET } from "./consts";
import { Headings } from "@/app/components/atoms/PortableText/utils";

export const useTableOfContents = (headings: Headings) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const entries = Object.values(headings)
        .map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { id, top: rect.top };
        })
        .filter((e): e is { id: string; top: number } => !!e)
        .filter((e) => e.top <= AUTO_SCROLL_OFFSET)
        .sort((a, b) => b.top - a.top);
      

      if (entries.length > 0) {
        setActiveId(entries[0].id);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -OFFSET;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return {
    handleScroll,
    activeId,
  }
}
