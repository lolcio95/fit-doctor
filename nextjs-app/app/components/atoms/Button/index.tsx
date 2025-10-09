import React from "react";
import {
  Button as UIButton,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/button";
import { LabeledLinkType } from "../BaseLink";

interface ButtonProps extends React.ComponentProps<"button"> {
  linkProps?: Pick<LabeledLinkType, "label">;
  text?: string;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPlacement?: "left" | "right";
}

export const Button = ({
  text,
  className,
  linkProps,
  variant = "default",
  size = "default",
  asChild,
  icon,
  iconPlacement = "right",
  ...props
}: ButtonProps) => {
  const { label } = linkProps || {};

  return (
    <UIButton
      variant={variant}
      asChild={asChild}
      size={size}
      className={className}
      {...props}
    >
      <span>
        {icon && iconPlacement === "left" && icon}
        {label ?? text}
        {icon && iconPlacement === "right" && icon}
      </span>
    </UIButton>
  );
};
