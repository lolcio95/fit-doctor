"use server";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import PaymentsClient from "./components/PaymentClient";

export default async function UserPlansPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-medium">Zaloguj się</h2>
        <p className="text-sm text-gray-500">
          Musisz się zalogować, aby zobaczyć swoje zamówienia.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-background-primary py-16">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-color-secondary mb-6">
          Moje plany
        </h1>
        <p className="text-color-tertiary mb-8 max-w-2xl">
          Lista wykupionych planów.
        </p>
        <PaymentsClient initialPageSize={10} />
      </div>
    </section>
  );
}
