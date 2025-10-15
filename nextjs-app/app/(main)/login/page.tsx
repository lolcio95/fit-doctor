"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      callbackUrl: "/",
      redirect: false,
    });
    if (res?.error) setError("Nieprawidłowe dane logowania.");
  };

  return (
    <section
      className="bg-background pt-16 md:pt-24"
      aria-labelledby="article-title"
    >
      {status === "unauthenticated" ? (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-xs mx-auto mb-4"
          >
            <input
              type="text"
              name="username"
              placeholder="Email lub nazwa użytkownika"
              value={form.username}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Hasło"
              value={form.password}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <Button type="submit">Zaloguj się</Button>
            {error && <div className="text-red-600">{error}</div>}
          </form>
          <div className="mb-4">
            <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
              Zaloguj się przez Google
            </Button>
          </div>
          <div>
            <a href="/registration" className="underline text-blue-700">
              Nie masz konta? Zarejestruj się
            </a>
          </div>
        </>
      ) : (
        <Button onClick={() => signOut()}>Wyloguj się</Button>
      )}
    </section>
  );
}
