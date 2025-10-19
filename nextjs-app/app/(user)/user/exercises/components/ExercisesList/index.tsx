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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const startEdit = (ex: Exercise) => {
    setEditingId(ex.id);
    setEditName(ex.name);
    setEditDescription(ex.description ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
      alert("Nazwa nie może być pusta.");
      return;
    }
    setSavingId(id);
    try {
      const res = await fetch(`/api/exercises/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Błąd przy zapisywaniu ćwiczenia.");
      } else {
        // Notify parent to refresh list
        if (onExerciseUpdated) onExerciseUpdated();
        // clear editing state
        cancelEdit();
      }
    } catch (err) {
      console.error("saveEdit error", err);
      alert("Błąd sieciowy.");
    } finally {
      setSavingId(null);
    }
  };

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
        <li key={ex.id} style={{ marginBottom: 8 }}>
          {editingId === ex.id ? (
            <>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ marginRight: 8 }}
              />
              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Opis (opcjonalnie)"
                style={{ marginRight: 8 }}
              />
              <button
                onClick={() => saveEdit(ex.id)}
                disabled={savingId === ex.id}
              >
                {savingId === ex.id ? "Zapisuję..." : "Zapisz"}
              </button>
              <button
                style={{ marginLeft: 8 }}
                onClick={cancelEdit}
                disabled={savingId === ex.id}
              >
                Anuluj
              </button>
            </>
          ) : (
            <>
              <strong>{ex.name}</strong>
              {ex.description && <span> – {ex.description}</span>}
              <button style={{ marginLeft: 8 }} onClick={() => startEdit(ex)}>
                Edytuj
              </button>
              <button
                style={{ marginLeft: 8, color: "red" }}
                onClick={() => handleDelete(ex.id)}
                disabled={deletingId === ex.id}
              >
                {deletingId === ex.id ? "Usuwanie..." : "Usuń"}
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
