"use client";

import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";

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
        if (onExerciseUpdated) onExerciseUpdated();
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
      }

      if (!confirm(message)) return;

      setDeletingId(id);
      const res = await fetch(`/api/exercises/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Błąd przy usuwaniu ćwiczenia.");
      } else {
        if (onExerciseDeleted) onExerciseDeleted();
        else if (onExerciseUpdated) onExerciseUpdated();
      }
    } catch (err) {
      console.error("delete error", err);
      alert("Błąd sieciowy.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-color-tertiary">Ładowanie...</p>;
  if (!exercises.length)
    return <p className="text-color-tertiary">Brak ćwiczeń. Dodaj pierwsze!</p>;

  return (
    <ul className="space-y-3">
      {exercises.map((ex) => (
        <li
          key={ex.id}
          className="p-4 rounded-lg bg-background-primary/50 border border-background-card flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
          <div>
            {editingId === ex.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-2 py-1 rounded border bg-transparent mb-2 md:mb-0"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Opis (opcjonalnie)"
                  className="px-2 py-1 rounded border bg-transparent md:ml-4"
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <strong className="text-color-primary">{ex.name}</strong>
                  {ex.usedCount ? (
                    <span className="text-sm text-color-tertiary">
                      ({ex.usedCount})
                    </span>
                  ) : null}
                </div>
                {ex.description && (
                  <p className="text-sm text-color-tertiary mt-1">
                    {ex.description}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 md:mt-0">
            {editingId === ex.id ? (
              <>
                <button
                  onClick={() => saveEdit(ex.id)}
                  disabled={savingId === ex.id}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded bg-color-primary text-background-primary"
                >
                  {savingId === ex.id ? "Zapisuję..." : "Zapisz"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 rounded border"
                >
                  Anuluj
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEdit(ex)}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded border hover:bg-background-card"
                  title="Edytuj"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Edytuj</span>
                </button>

                <button
                  onClick={() => handleDelete(ex.id)}
                  disabled={deletingId === ex.id}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded border text-red-500 hover:bg-red-50"
                  title="Usuń"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">
                    {deletingId === ex.id ? "Usuwanie..." : "Usuń"}
                  </span>
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
