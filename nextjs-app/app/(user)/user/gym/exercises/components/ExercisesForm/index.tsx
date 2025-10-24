"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function ExerciseForm({
  onExerciseAdded,
}: {
  onExerciseAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nazwa ćwiczenia jest wymagana.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Błąd podczas dodawania ćwiczenia.");
        return;
      }
      setName("");
      setDescription("");
      if (onExerciseAdded) onExerciseAdded();
    } catch (err) {
      console.error("add exercise error", err);
      alert("Błąd sieciowy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm text-color-tertiary">Nazwa</label>
      <input
        required
        placeholder="Nazwa ćwiczenia"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary"
      />

      <label className="text-sm text-color-tertiary">Opis (opcjonalnie)</label>
      <textarea
        placeholder="Krótki opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border bg-transparent h-24 resize-none focus:outline-none focus:ring-2 focus:ring-color-primary"
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-lg bg-color-primary text-background-primary hover:opacity-95 disabled:opacity-60"
      >
        <Plus className="w-4 h-4" />
        {loading ? "Dodawanie..." : "Dodaj ćwiczenie"}
      </button>
    </form>
  );
}
