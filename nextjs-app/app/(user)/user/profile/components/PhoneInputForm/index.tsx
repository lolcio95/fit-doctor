import React from "react";
import { UseFormRegisterReturn, FieldErrors } from "react-hook-form";

type PhoneInputProps = {
  value?: string;
  onChange: (v: string) => void;
  register: UseFormRegisterReturn;
  errors?: FieldErrors;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
};

const group3 = (s: string) => {
  if (!s) return "";
  return s.match(/.{1,3}/g)?.join(" ") ?? s;
};

export const formatDisplayPhone = (raw: string) => {
  if (raw == null) return "";
  const trimmed = raw.trim();

  const hasPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (hasPlus) {
    if (!digitsOnly) return "+";

    if (digitsOnly.startsWith("48")) {
      const rest = digitsOnly.slice(2, 11); // up to 9 national digits
      const groupedRest = group3(rest);
      return `+48${groupedRest ? " " + groupedRest : ""}`;
    }

    const afterPlus = raw
      .replace(/^\+/, "")
      .replace(/[^\d\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return `+${afterPlus}`;
  } else {
    const national = digitsOnly.slice(0, 9);
    return group3(national);
  }
};

export const normalizePhoneForSending = (
  display: string | undefined
): string | undefined => {
  if (!display) return undefined;
  const trimmed = display.trim();
  if (!trimmed) return undefined;

  const noSpaces = trimmed.replace(/\s+/g, "");
  const hasPlus = noSpaces.startsWith("+");
  const digits = noSpaces.replace(/\D/g, "");
  if (!digits) return undefined;

  if (hasPlus) {
    if (!digits.startsWith("48")) return undefined;
    return `+${digits}`;
  } else {
    return `+48${digits}`;
  }
};

const phoneDisplayRegex =
  /^(?:\+48\s?\d{3}\s?\d{3}\s?\d{3}|\d{3}\s?\d{3}\s?\d{3})$/;

export default function PhoneInput({
  value,
  onChange,
  register,
  errors,
  disabled,
  placeholder,
  label = "Numer telefonu",
}: PhoneInputProps) {
  return (
    <div>
      <label className="text-xs text-color-tertiary mt-2">{label}</label>
      <input
        className="w-full rounded p-2 text-sm border"
        {...register}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          const formatted = formatDisplayPhone(raw);
          onChange(formatted);
        }}
        placeholder={placeholder ?? "+48 123 456 789 lub 123 456 789"}
        inputMode="tel"
        disabled={disabled}
      />
      {errors?.phone && (
        <p className="text-red-600 text-sm mt-1">
          {(errors.phone as any)?.message as string}
        </p>
      )}
      <p className="text-xs text-color-tertiary mt-1">
        Akceptowane formaty: +48 123 456 789 lub 123 456 789
      </p>
    </div>
  );
}
