"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegistrationPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Rejestracja udana! Możesz się zalogować.");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(data.error || "Wystąpił błąd.");
    }
  };

  return (
    <section
      className="bg-background pt-16 md:pt-24"
      aria-labelledby="registration-title"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-xs mx-auto mb-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Nazwa użytkownika"
          value={form.name}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
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
        <Button type="submit">Zarejestruj się</Button>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
      <div>
        <Link href="/login" className="underline text-blue-700">
          Masz już konto? Zaloguj się
        </Link>
      </div>
    </section>
  );
}
