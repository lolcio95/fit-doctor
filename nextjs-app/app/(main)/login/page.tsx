"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import googleLogo from "@/public/assets/google-logo.png";
import NextImage from "next/image";
import ResendVerificationForm from "@/app/components/molecules/ResendVerificationForm";

type FormValues = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setFocus,
  } = useForm<FormValues>({
    defaultValues: { username: "", password: "" },
    mode: "onBlur",
  });

  const clearPasswordField = () => {
    setValue("password", "");
    setFocus("password");
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setResendEmail(null);

    try {
      const res = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error) {
        const decoded = decodeURIComponent(res.error || "");
        const cleaned =
          decoded.replace(/^Error:\s*/i, "") || "Nieprawidłowe dane logowania.";
        const friendly =
          cleaned === "CredentialsSignin"
            ? "Nieprawidłowy login lub hasło."
            : cleaned;

        if (cleaned === "NOT_VERIFIED") {
          setServerError("NOT_VERIFIED");
          setResendEmail(values.username);
        } else {
          setServerError(friendly);
        }

        clearPasswordField();
        return;
      }

      if (res?.ok) {
        router.push(res.url ?? "/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerError("Wystąpił błąd podczas logowania. Spróbuj ponownie.");
    }
  };

  return (
    <section
      className="bg-background-primary py-16 md:py-24"
      aria-labelledby="article-title"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-w-xs mx-auto mb-4"
        noValidate
      >
        <div className="relative">
          <input
            {...register("username", {
              required: "Email lub nazwa użytkownika jest wymagana",
              maxLength: { value: 100, message: "Maksymalnie 100 znaków" },
            })}
            type="text"
            placeholder="Email lub nazwa użytkownika"
            className="border rounded px-3 py-2 w-full"
            aria-invalid={errors.username ? "true" : "false"}
          />
          {errors.username && (
            <div className="absolute left-0 right-0 bottom-[1px] translate-y-[100%]">
              <p className="text-red-600 text-xs mt-1">
                {errors.username.message}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <input
            {...register("password", {
              required: "Hasło jest wymagane",
              minLength: { value: 6, message: "Minimum 6 znaków" },
              maxLength: { value: 128, message: "Maksymalnie 128 znaków" },
            })}
            type="password"
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logowanie..." : "Zaloguj się"}
        </Button>

        {serverError && (
          <div className="text-red-600 text-center mt-[-10px]">
            {serverError === "NOT_VERIFIED"
              ? "Musisz najpierw potwierdzić adres e-mail."
              : serverError}
          </div>
        )}
      </form>

      {serverError === "NOT_VERIFIED" && resendEmail && (
        <div className="max-w-xs mx-auto">
          <ResendVerificationForm defaultEmail={resendEmail} />
        </div>
      )}

      <div className="flex flex-col gap-4 max-w-xs mx-auto mb-10">
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
        <div>
          <ButtonLink
            href="/registration"
            className="underline w-full"
            variant={"link"}
            text="Nie masz konta? Zarejestruj się"
          />
          <ButtonLink
            href="/forgot-password"
            className="underline w-full"
            variant={"link"}
            text="Zapomniałem hasła"
          />
        </div>
      </div>
    </section>
  );
}
