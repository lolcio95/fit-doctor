"use client";

import React from "react";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/button";
import { BaseLink, BaseLinkProps } from "../BaseLink";

interface ButtonLinkProps extends BaseLinkProps {
  text?: string;
  className?: string;
  linkClassName?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPlacement?: "left" | "right";
}

export const ButtonLink = ({
  link,
  text,
  className,
  linkClassName,
  variant = "default",
  size = "default",
  icon,
  iconPlacement = "right",
  ...props
}: ButtonLinkProps) => {
  return (
    <BaseLink {...props} className={linkClassName} link={link}>
      <Button variant={variant} asChild size={size} className={className}>
        <span>
          {icon && iconPlacement === "left" && icon}
          {link?.label ?? text}
          {icon && iconPlacement === "right" && icon}
        </span>
      </Button>
    </BaseLink>
  );
};
