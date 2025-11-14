"use client";

import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

const group3 = (s: string) => (!s ? "" : (s.match(/.{1,3}/g)?.join(" ") ?? s));

export const formatDisplayPhone = (raw: string) => {
  if (raw == null) return "";
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (hasPlus) {
    if (!digitsOnly) return "+";
    if (digitsOnly.startsWith("48")) {
      const rest = digitsOnly.slice(2, 11);
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

export const normalizePhoneForSending = (display?: string) => {
  if (!display) return undefined;
  const trimmed = display.trim();
  const noSpaces = trimmed.replace(/\s+/g, "");
  const hasPlus = noSpaces.startsWith("+");
  const digits = noSpaces.replace(/\D/g, "");
  if (!digits) return undefined;
  return hasPlus
    ? digits.startsWith("48")
      ? `+${digits}`
      : undefined
    : `+48${digits}`;
};

const phoneDisplayRegex =
  /^(?:\+48\s?\d{3}\s?\d{3}\s?\d{3}|\d{3}\s?\d{3}\s?\d{3})$/;

export type PhoneFormValues = {
  phone: string;
};

type PhoneInputFormProps = {
  control: Control<PhoneFormValues>;
  errors?: FieldErrors<PhoneFormValues>;
  disabled?: boolean;
};

export function PhoneInputForm({
  control,
  errors,
  disabled,
}: PhoneInputFormProps) {
  return (
    <form className="space-y-3">
      <Controller
        name="phone"
        control={control}
        rules={{
          required: "Numer telefonu jest wymagany",
          validate: (v) =>
            phoneDisplayRegex.test(v ?? "")
              ? true
              : "Numer telefonu może być napisany tylko w takim formacie +48 123 456 789 lub 123 456 789",
        }}
        render={({ field }) => (
          <div>
            <label className="text-xs text-color-tertiary mt-2">
              Numer telefonu
            </label>
            <input
              type="tel"
              className="w-full rounded p-2 text-sm border"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(formatDisplayPhone(e.target.value))
              }
              placeholder="+48 123 456 789 lub 123 456 789"
              disabled={disabled}
            />
            {errors?.phone && (
              <p className="text-red-600 text-sm mt-1">
                {errors.phone.message as string}
              </p>
            )}
            <p className="text-xs text-color-tertiary mt-1">
              Akceptowane formaty: +48 123 456 789 lub 123 456 789
            </p>
          </div>
        )}
      />
    </form>
  );
}
