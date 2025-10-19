"use client";

import Link from "next/link";
import { useState } from "react";

type Training = {
  id: string;
  date: string;
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

  if (loading) return <p>Ładowanie...</p>;
  if (!trainings?.length) return <p>Brak treningów. Dodaj pierwszy trening!</p>;

  return (
    <ul>
      {trainings.map((tr) => (
        <li key={tr.id} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <strong>Data:</strong>{" "}
              {new Date(tr.date).toLocaleDateString("pl-PL")}
            </div>
            <div>
              <Link href={`/user/trainings/edit/${tr.id}`}>
                <button type="button">Edytuj</button>
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(tr.id)}
                disabled={deletingId === tr.id}
                style={{ marginLeft: 8, color: "red" }}
              >
                {deletingId === tr.id ? "Usuwanie..." : "Usuń"}
              </button>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>Ćwiczenia:</strong>
            <ul>
              {tr.exercises.map((ex) => (
                <li key={ex.id}>
                  {ex.exercise?.name || "?"} | Ciężar: {ex.weight ?? "-"} kg |
                  Serie: {ex.sets} | Powt.: {ex.reps}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
