import React, { InputHTMLAttributes } from "react";
import { Calendar } from "lucide-react";
import clsx from "clsx";

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  className?: string;
}

export const DateInput = ({ className, ...props }: DateInputProps) => {
  return (
    <div className={clsx("relative", className)}>
      <input type="date" {...props} className="w-full" />
      <Calendar className="absolute right-[14px] top-[10px] w-4 h-4 text-color-primary z-0" />
    </div>
  );
};
