"use client";
import React, { useEffect } from "react";

export interface CalendlyWidgetProps {
  url: string;
}

export const CalendlyWidget = ({ url }: CalendlyWidgetProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div
      className="calendly-inline-widget min-h-[18.75rem]"
      data-url={url}
      data-resize="true"
    />
  );
};
