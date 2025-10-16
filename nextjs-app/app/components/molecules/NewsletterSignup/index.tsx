"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface NewsletterSignupProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  errorMessage?: string;
}

export const NewsletterSignup = ({
  className = "",
  placeholder = "Twój adres email",
  buttonText = "Zapisz się",
  successMessage = "Dziękujemy za subskrypcję!",
  errorMessage = "Wystąpił błąd. Spróbuj ponownie.",
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!email || !email.trim()) {
        setStatus("error");
        setMessage("Wprowadź adres email");
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || successMessage);
          setEmail("");
        } else {
          setStatus("error");
          setMessage(data.error || errorMessage);
        }
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        setStatus("error");
        setMessage(errorMessage);
      }
    },
    [email, successMessage, errorMessage]
  );

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === "error" || status === "success") {
      setStatus("idle");
      setMessage("");
    }
  }, [status]);

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder={placeholder}
          disabled={status === "loading" || status === "success"}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Email address"
          required
        />
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="whitespace-nowrap"
        >
          {status === "loading" ? "Zapisywanie..." : buttonText}
        </Button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </div>
  );
};
