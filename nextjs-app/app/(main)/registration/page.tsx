"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { signIn } from "next-auth/react";
import googleLogo from "@/public/assets/google-logo.png";
import NextImage from "next/image";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    setFocus,
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const clearPasswordField = () => {
    setValue("password", "");
    setValue("confirmPassword", "");
    setFocus("password");
  };

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setSuccess(null);

    try {
      // opcjonalnie dodatkowa walidacja po stronie klienta
      if (data.password !== data.confirmPassword) {
        setServerError("Hasła nie są takie same.");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json?.error || "Wystąpił błąd podczas rejestracji.");
        clearPasswordField();
        return;
      }

      setSuccess(
        "Rejestracja udana! Sprawdź swój e‑mail, aby potwierdzić konto."
      );
      reset();
    } catch (err) {
      console.error("Registration error:", err);
      setServerError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      clearPasswordField();
    }
  };

  return (
    <section
      className="bg-background-primary py-16 md:py-24"
      aria-labelledby="registration-title"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-w-xs mx-auto mb-4"
        noValidate
      >
        <div className="relative">
          <input
            {...register("name", {
              required: "Nazwa użytkownika jest wymagana",
              maxLength: { value: 50, message: "Maksymalnie 50 znaków" },
            })}
            name="name"
            placeholder="Nazwa użytkownika"
            className="border rounded px-3 py-2 w-full"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <div className="absolute left-0 right-0 bottom-[1px] translate-y-[100%]">
              <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
            </div>
          )}
        </div>
        <div className="relative">
          <input
            {...register("email", {
              required: "Email jest wymagany",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Nieprawidłowy adres email",
              },
              maxLength: { value: 100, message: "Maksymalnie 100 znaków" },
            })}
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded px-3 py-2 w-full"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <div className="absolute left-0 right-0 bottom-[1px] translate-y-[100%]">
              <p className="text-red-600 text-xs mt-1">
                {errors.email.message}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <input
            {...register("password", {
              required: "Hasło jest wymagane",
              minLength: { value: 8, message: "Minimum 8 znaków" },
              maxLength: { value: 128, message: "Maksymalnie 128 znaków" },
            })}
            type="password"
            name="password"
            placeholder="Hasło"
            className="border rounded px-3 py-2 w-full"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <div className="absolute left-0 right-0 bottom-[1px] translate-y-[100%]">
              <p className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            </div>
          )}
        </div>
        <div className="relative">
          <input
            {...register("confirmPassword", {
              required: "Potwierdzenie hasła jest wymagane",
              validate: (value) =>
                value === watch("password") || "Hasła nie są takie same",
            })}
            type="password"
            name="confirmPassword"
            placeholder="Powtórz hasło"
            className="border rounded px-3 py-2 w-full"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {errors.confirmPassword && (
            <div className="absolute left-0 right-0 bottom-[1px] translate-y-[100%]">
              <p className="text-red-600 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Rejestruję..." : "Zarejestruj się"}
        </Button>

        {serverError && (
          <div className="text-red-600 text-center mt-[-10px]">
            {serverError}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-center mt-[-10px]">{success}</div>
        )}
      </form>

      <div className="flex justify-center flex-col max-w-xs mx-auto gap-4">
        <Button
          variant={"default"}
          className="bg-color-primary gap-0 text-background-primary hover-never:bg-color-tertiary"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <NextImage
            className="mx-2 rounded-full w-6 h-6 object-cover"
            src={googleLogo}
            alt="Google Logo"
            width={40}
            height={40}
            placeholder="empty"
            priority
          />
          Zaloguj się przez Google
        </Button>

        <ButtonLink
          variant={"link"}
          href="/login"
          className="underline w-full"
          text="Masz już konto? Zaloguj się"
        />
      </div>
    </section>
  );
}
