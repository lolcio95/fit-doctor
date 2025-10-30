"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfilePasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);

  const clearPasswordFields = () => {
    setValue("currentPassword", "");
    setValue("newPassword", "");
    setValue("confirmPassword", "");
    setFocus("currentPassword");
  };

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setServerMessage(null);

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json?.error || "Nie udało się zmienić hasła.");
        // clear sensitive fields when there's an error (same UX as registration)
        clearPasswordFields();
        return;
      }

      setServerMessage(json?.message || "Hasło zostało zmienione.");
      reset();
    } catch (err) {
      console.error("change-password client error", err);
      setServerError("Wystąpił błąd. Spróbuj ponownie później.");
      clearPasswordFields();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label className="text-sm text-color-tertiary">Aktualne hasło</label>
      <input
        {...register("currentPassword", {
          required: "Aktualne hasło jest wymagane",
        })}
        name="currentPassword"
        type="password"
        className="border rounded px-3 py-2 bg-background-primary/5"
        placeholder="Aktualne hasło"
        autoComplete="current-password"
        aria-invalid={errors.currentPassword ? "true" : "false"}
      />
      {errors.currentPassword && (
        <p className="text-xs text-red-600">{errors.currentPassword.message}</p>
      )}

      <label className="text-sm text-color-tertiary">Nowe hasło</label>
      <input
        {...register("newPassword", {
          required: "Nowe hasło jest wymagane",
          minLength: { value: 8, message: "Minimum 8 znaków" },
          maxLength: { value: 128, message: "Maksymalnie 128 znaków" },
        })}
        name="newPassword"
        type="password"
        className="border rounded px-3 py-2 bg-background-primary/5"
        placeholder="Nowe hasło (min. 8 znaków)"
        autoComplete="new-password"
        aria-invalid={errors.newPassword ? "true" : "false"}
      />
      {errors.newPassword && (
        <p className="text-xs text-red-600">{errors.newPassword.message}</p>
      )}

      <label className="text-sm text-color-tertiary">Powtórz nowe hasło</label>
      <input
        {...register("confirmPassword", {
          required: "Powtórzenie hasła jest wymagane",
          validate: (value) =>
            value === watch("newPassword") || "Hasła nie są takie same",
        })}
        name="confirmPassword"
        type="password"
        className="border rounded px-3 py-2 bg-background-primary/5"
        placeholder="Powtórz nowe hasło"
        autoComplete="new-password"
        aria-invalid={errors.confirmPassword ? "true" : "false"}
      />
      {errors.confirmPassword && (
        <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
      )}

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      {serverMessage && (
        <p className="text-sm text-green-600">{serverMessage}</p>
      )}

      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Przetwarzanie..." : "Zmień hasło"}
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            reset();
            setServerError(null);
            setServerMessage(null);
            setFocus("currentPassword");
          }}
        >
          Anuluj
        </Button>
      </div>
    </form>
  );
}
