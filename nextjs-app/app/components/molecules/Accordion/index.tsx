"use client";
import { RichText } from "@/sanity.types";
import { PortableText } from "@/app/components/atoms/PortableText";
import React, { useState } from "react";
import { ChevronDownIcon } from "@sanity/icons";
import clsx from "clsx";

export interface AccordionProps {
  question?: string;
  answer?: RichText;
}
export const Accordion = ({ question, answer }: AccordionProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden border border-b border-b-slate-300 transition-all">
      <div
        className={"flex justify-between items-center cursor-pointer"}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <p className="font-bold">{question}</p>
        <ChevronDownIcon
          width={40}
          height={40}
          className={clsx({ "rotate-180": expanded })}
        />
      </div>
      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <PortableText value={answer} className="overflow-hidden" />
      </div>
    </div>
  );
};
