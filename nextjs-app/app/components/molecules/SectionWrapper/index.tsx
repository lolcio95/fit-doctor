import clsx from "clsx";
import React, { FC, PropsWithChildren } from "react";
import { SectionWrapperProps } from "./types";
import { getTextColor } from "@/utils/colors";

const SectionWrapper: FC<PropsWithChildren<SectionWrapperProps>> = ({
  backgroundColor,
  defaultBgClassName,
  children,
  className,
}) => {
  const textColorClassName = getTextColor(backgroundColor?.label);

  const bgClassName = !backgroundColor?.value ? defaultBgClassName : "";

  return (
    <section
      className={clsx(className, textColorClassName, bgClassName, {
        "bg-secondary from-primary/0 via-primary/30 to-primary/0 gradient bg-gradient-to-r":
          backgroundColor?.label === "Brand Gradient",
      })}
      style={{
        backgroundColor:
          backgroundColor?.value && backgroundColor?.label !== "Brand Gradient"
            ? backgroundColor.value
            : undefined,
      }}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
