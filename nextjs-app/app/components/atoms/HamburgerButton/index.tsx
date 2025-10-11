import React from "react";

export interface HamburgerButtonProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}
export const HamburgerButton = ({
  isOpen,
  setIsOpen,
}: HamburgerButtonProps) => {
  return (
    <button
      aria-pressed={isOpen}
      onClick={setIsOpen ? () => setIsOpen(!isOpen) : undefined}
      className="group inline-flex w-9 h-9 border-2 border-color-tertiary text-color-tertiary bg-transparent text-center items-center justify-center rounded-lg shadow-[0_1px_0_theme(colors.slate.950/.04),0_1px_2px_theme(colors.slate.950/.12),inset_0_-2px_0_theme(colors.slate.950/.04)] hover:shadow-[0_1px_0_theme(colors.slate.950/.04),0_4px_8px_theme(colors.slate.950/.12),inset_0_-2px_0_theme(colors.slate.950/.04)] transition"
    >
      <span className="sr-only">Menu</span>
      <svg
        className="w-6 h-6 fill-current pointer-events-none"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          className="origin-center -translate-y-[5px] translate-x-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-[[aria-pressed=true]]:translate-x-0 group-[[aria-pressed=true]]:translate-y-0 group-[[aria-pressed=true]]:rotate-[315deg]"
          y="7"
          width="9"
          height="2"
          rx="1"
        ></rect>
        <rect
          className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-[[aria-pressed=true]]:rotate-45"
          y="7"
          width="16"
          height="2"
          rx="1"
        ></rect>
        <rect
          className="origin-center translate-y-[5px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-[[aria-pressed=true]]:translate-y-0 group-[[aria-pressed=true]]:rotate-[135deg]"
          y="7"
          width="9"
          height="2"
          rx="1"
        ></rect>
      </svg>
    </button>
  );
};
