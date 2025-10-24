"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Edit3, Trash2, Clock } from "lucide-react";

type Training = {
  id: string;
  date: string;
  status?: string;
  exercises: {
    id: string;
    exercise: { id?: string; name?: string };
    weight?: number | null;
    sets: number;
    reps: number;
  }[];
};

export default function TrainingList({
  trainings,
  loading,
  onRefresh,
}: {
  trainings: Training[];
  loading: boolean;
  onRefresh?: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Na pewno usunąć ten trening?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trainings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Błąd przy usuwaniu treningu.");
      } else {
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      alert("Błąd sieciowy.");
    } finally {
      setDeletingId(null);
    }
  };

  // ensure IN_PROGRESS trainings are always at the top, then sort others by date desc
  const sortedTrainings = useMemo(() => {
    return [...trainings].sort((a, b) => {
      const aActive = a.status === "IN_PROGRESS";
      const bActive = b.status === "IN_PROGRESS";
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      // if both same active state - sort by date desc (newest first)
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return bTime - aTime;
    });
  }, [trainings]);

  if (loading) return <p className="text-color-tertiary">Ładowanie...</p>;
  if (!trainings?.length)
    return (
      <p className="text-color-tertiary">
        Brak treningów. Dodaj pierwszy trening!
      </p>
    );

  return (
    <ul className="space-y-4">
      {sortedTrainings.map((tr) => {
        const isActive = tr.status === "IN_PROGRESS";

        return (
          <li
            key={tr.id}
            className={`relative overflow-hidden p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3 transition-shadow ${
              isActive
                ? "border-yellow-400 shadow-lg ring-1 ring-yellow-200"
                : "bg-background-primary/50 border-background-card"
            }`}
          >
            {isActive && (
              <div className="absolute left-0 top-0 h-full w-1 bg-yellow-400" />
            )}

            <div className="flex-1">
              <div className="flex xl:items-center gap-3 flex-col xl:flex-row">
                <div className="flex gap-2 items-center">
                  <Clock className="w-4 h-4 text-color-primary" />
                  <strong className="text-color-primary">
                    {new Date(tr.date).toLocaleDateString("pl-PL")}
                  </strong>
                </div>

                <span className="text-sm text-color-tertiary">
                  · {tr.exercises.length} ćwiczeń
                </span>

                {isActive && (
                  <div className="ml-3 inline-flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                        AKTYWNY TRENING
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2 text-sm text-color-tertiary">
                {tr.exercises.slice(0, 3).map((ex) => (
                  <span key={ex.id} className="inline-block mr-3">
                    {ex.exercise?.name ?? "?"}
                    {ex.weight ? ` • ${ex.weight}kg` : ""} • {ex.sets}×{ex.reps}
                  </span>
                ))}
                {tr.exercises.length > 3 && (
                  <span className="text-color-tertiary">i więcej...</span>
                )}
              </div>

              {isActive && (
                <div className="mt-3 text-sm text-color-primary">
                  Ten trening jest aktualnie otwarty — dodawaj serie lub zakończ
                  sesję, aby utworzyć nowy.
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/user/gym/trainings/edit/${tr.id}`}>
                <p
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border hover:bg-background-card`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edytuj</span>
                </p>
              </Link>

              <button
                onClick={() => handleDelete(tr.id)}
                disabled={deletingId === tr.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {deletingId === tr.id ? "Usuwanie..." : "Usuń"}
                </span>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
