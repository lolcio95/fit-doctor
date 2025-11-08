"use client";

import Link from "next/link";
import { List, Clipboard, TrendingUp } from "lucide-react";

export default function GymPage() {
  return (
    <section className="bg-background-primary py-16 px-0 lg:px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-color-secondary mb-6">
          Moja siłownia
        </h1>

        <p className="text-color-tertiary mb-8 max-w-2xl">
          Zarządzaj swoimi ćwiczeniami i planami treningowymi. Wybierz jedną z
          poniższych opcji, aby przejść dalej.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/user/gym/exercises"
            className="group flex items-center gap-4 p-6 rounded-2xl bg-background-card hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-color-primary"
            aria-label="Zarządzaj ćwiczeniami"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-color-primary/10 text-color-primary group-hover:bg-color-primary/20 transition-colors">
              <List className="w-6 h-6 text-color-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-color-primary">
                Zarządzaj ćwiczeniami
              </h2>
              <p className="text-sm text-color-tertiary mt-1">
                Dodawaj, edytuj i organizuj swoje ćwiczenia.
              </p>
            </div>
          </Link>

          <Link
            href="/user/gym/trainings"
            className="group flex items-center gap-4 p-6 rounded-2xl bg-background-card hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-color-primary"
            aria-label="Zarządzaj treningami"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-color-primary/10 text-color-primary group-hover:bg-color-primary/20 transition-colors">
              <Clipboard className="w-6 h-6 text-color-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-color-primary">
                Zarządzaj treningami
              </h2>
              <p className="text-sm text-color-tertiary mt-1">
                Twórz i planuj swoje sesje treningowe.
              </p>
            </div>
          </Link>

          <Link
            href="/user/gym/progress"
            className="group flex items-center gap-4 p-6 rounded-2xl bg-background-card hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-color-primary"
            aria-label="Progres"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-color-primary/10 text-color-primary group-hover:bg-color-primary/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-color-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-color-primary">
                Progres
              </h2>
              <p className="text-sm text-color-tertiary mt-1">
                Śledź swoje wyniki i postępy w treningach.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
