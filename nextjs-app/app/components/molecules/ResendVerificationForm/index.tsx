"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function ResendVerificationForm({
  defaultEmail,
}: {
  defaultEmail?: string;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!defaultEmail) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: defaultEmail }),
      });
    } catch (err) {
      console.error("Resend verification error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <Button
        variant="link"
        type="submit"
        disabled={isSubmitting}
        className="underline w-full mb-4"
      >
        {isSubmitting ? "Wysyłam..." : "Wyślij ponownie link weryfikacyjny"}
      </Button>
    </form>
  );
}
