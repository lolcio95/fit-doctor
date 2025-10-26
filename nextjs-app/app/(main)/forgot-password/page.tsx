"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

type FormValues = { email: string };

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: "onBlur" });
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setMessage(null);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      setMessage(json?.message || "Sprawdź swój e‑mail.");
    } catch (err) {
      console.error(err);
      setMessage("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <section className="py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xs mx-auto flex flex-col gap-4"
      >
        <input
          {...register("email", { required: "Email jest wymagany" })}
          placeholder="Twój email"
          className="border px-3 py-2 rounded"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Wysyłam..." : "Wyślij link do resetu"}
        </Button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </section>
  );
}
