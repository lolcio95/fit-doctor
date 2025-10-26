"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type FormValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: "onBlur" });
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setSuccess(null);

    if (data.password !== data.confirmPassword) {
      setServerError("Hasła nie są takie same");
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json?.error || "Błąd podczas resetu hasła.");
        return;
      }
      setSuccess(
        json?.message || "Hasło zresetowane. Przekierowuję do logowania..."
      );
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error(err);
      setServerError("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  if (!token) {
    return (
      <p className="text-center">Brak tokenu w URL. Sprawdź link z e‑maila.</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xs mx-auto flex flex-col gap-4"
    >
      <input
        {...register("password", {
          required: "Hasło jest wymagane",
          minLength: { value: 8, message: "Minimum 8 znaków" },
        })}
        type="password"
        placeholder="Nowe hasło"
        className="border px-3 py-2 rounded"
      />
      {errors.password && (
        <p className="text-red-600 text-sm">{errors.password.message}</p>
      )}

      <input
        {...register("confirmPassword", { required: "Potwierdź hasło" })}
        type="password"
        placeholder="Powtórz nowe hasło"
        className="border px-3 py-2 rounded"
      />
      {errors.confirmPassword && (
        <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Resetuję..." : "Zresetuj hasło"}
      </Button>

      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </form>
  );
}
