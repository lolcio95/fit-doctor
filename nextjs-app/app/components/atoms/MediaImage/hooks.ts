"use client";

import { useState, useEffect } from "react";

export const useSvg = (imageSrc?: string) => {
  const [svgContent, setSvgContent] = useState("");

  const isSvgUrl = (url: string) => {
    try {
      const pathname = new URL(url, window.location.href).pathname;
      return /\.svg$/i.test(pathname);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      if (!imageSrc || !isSvgUrl(imageSrc)) return;

      try {
        const res = await fetch(imageSrc);
        let text = await res.text();

        const vb = text.match(/viewBox="([^"]+)"/i)?.[1] || "0 0 100 100";

        text = text.replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"');
        text = text.replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"');

        text = text.replace(
          /<svg[^>]*>/i,
          `<svg
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

  return { svgContent };
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
