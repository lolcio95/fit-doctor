"use client";

import { useState, useEffect } from "react";

export const useSvg = (imageSrc?: string) => {
  const [svgContent, setSvgContent] = useState("");

  const isSvgUrl = (url: string) => {
    const pathname = new URL(url).pathname;
    return /\.svg$/i.test(pathname);
  };

  useEffect(() => {
    (async () => {
      if (!imageSrc || !isSvgUrl(imageSrc)) return;

      try {
        const res = await fetch(imageSrc);
        let text = await res.text();

        const origTag = text.match(/<svg[^>]*>/i)?.[0] ?? "";
        const vb = text.match(/viewBox="([^"]+)"/i)?.[1] || "0 0 100 100";

        text = text.replace(/(fill|stroke)="[^"]*"/gi, "");

        text = text.replace(
          /<svg[^>]*>/i,
          `<svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            preserveAspectRatio="xMidYMid meet"
            viewBox="${vb}"
            style="width:100%;height:100%;display:block;"
          >`.replace(/\s+/g, " ")
        );

        setSvgContent(text);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [imageSrc]);

  return {
    svgContent,
  };
};

export const useIsMobile = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth || 0 : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth || 0);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window?.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth < 768;
};
