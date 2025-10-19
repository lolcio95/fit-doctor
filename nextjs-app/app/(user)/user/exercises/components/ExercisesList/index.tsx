"use client";

import { useState } from "react";

type Exercise = {
  id: string;
  name: string;
  description?: string;
  usedCount?: number;
};

export default function ExerciseList({
  exercises,
  loading,
  onExerciseUpdated,
  onExerciseDeleted,
}: {
  exercises: Exercise[];
  loading: boolean;
  onExerciseUpdated?: () => void;
  onExerciseDeleted?: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    // first fetch exercise details (includes usedCount)
    try {
      const infoRes = await fetch(`/api/exercises/${id}`);
      if (!infoRes.ok) {
        const d = await infoRes.json().catch(() => ({}));
        alert(d.error || "Nie można pobrać informacji o ćwiczeniu.");
        return;
      }
      const info = await infoRes.json();

      const usedCount: number = Number(info.usedCount ?? 0);

      let message = "Na pewno usunąć ćwiczenie?";
      if (usedCount > 0) {
        message = `To ćwiczenie jest użyte w ${usedCount} treningu/treningach.\n\nUsunięcie spowoduje, że zostanie ono również usunięte z tych treningów.\n\nCzy chcesz kontynuować?`;
      } else {
        message = "Na pewno usunąć ćwiczenie?";
      }

      if (!confirm(message)) return;

      setDeletingId(id);
      const res = await fetch(`/api/exercises/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Błąd przy usuwaniu ćwiczenia.");
      } else {
        // success: trigger parent refresh if provided
        if (onExerciseDeleted) onExerciseDeleted();
        else if (onExerciseUpdated) onExerciseUpdated();
      }
    } catch (err) {
      alert("Błąd sieciowy.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (!exercises.length) return <p>Brak ćwiczeń. Dodaj pierwsze!</p>;

  return (
    <ul>
      {exercises.map((ex) => (
        <li key={ex.id}>
          <strong>{ex.name}</strong>
          {ex.description && <span> – {ex.description}</span>}
          <button
            style={{ marginLeft: 8 }}
            onClick={() => {
              /* handle edit */
            }}
          >
            Edytuj
          </button>
          <button
            style={{ marginLeft: 8, color: "red" }}
            onClick={() => handleDelete(ex.id)}
            disabled={deletingId === ex.id}
          >
            {deletingId === ex.id ? "Usuwanie..." : "Usuń"}
          </button>
        </li>
      ))}
    </ul>
  );
}
