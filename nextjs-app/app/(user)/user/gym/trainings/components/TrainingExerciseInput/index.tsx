"use client";

import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

type TrainingExerciseForm = {
  exerciseId: string;
  name: string;
  weight?: string;
  sets: string;
  reps: string;
};

export default function TrainingExerciseInput({
  exercises,
  selectedExercises,
  setSelectedExercises,
}: {
  exercises: any[];
  selectedExercises: TrainingExerciseForm[];
  setSelectedExercises: React.Dispatch<
    React.SetStateAction<TrainingExerciseForm[]>
  >;
}) {
  const [exerciseId, setExerciseId] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const handleAddExercise = () => {
    if (!exerciseId || !sets || !reps) {
      alert("Wybierz ćwiczenie i podaj serie oraz powtórzenia.");
      return;
    }
    const ex = exercises.find((ex: any) => ex.id === exerciseId);
    setSelectedExercises((prev) => [
      ...prev,
      {
        exerciseId,
        name: ex?.name ?? "",
        weight,
        sets,
        reps,
      },
    ]);
    setExerciseId("");
    setWeight("");
    setSets("");
    setReps("");
  };

  const handleRemove = (idx: number) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-color-primary">Ćwiczenia</h3>

      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <label className="text-sm text-color-tertiary">Ćwiczenie</label>
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary"
          >
            <option value="">Wybierz ćwiczenie</option>
            {exercises.map((ex: any) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-28">
          <label className="text-sm text-color-tertiary">Ciężar (kg)</label>
          <input
            type="number"
            placeholder="kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min={0}
            className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary"
          />
        </div>

        <div className="w-24">
          <label className="text-sm text-color-tertiary">Serie</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            min={1}
            className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary"
          />
        </div>

        <div className="w-28">
          <label className="text-sm text-color-tertiary">Powt./serię</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min={1}
            className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary"
          />
        </div>

        <button
          type="button"
          onClick={handleAddExercise}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-color-primary text-background-primary hover:opacity-95"
        >
          <PlusCircle className="w-4 h-4" />
          Dodaj
        </button>
      </div>

      <ul className="space-y-2">
        {selectedExercises.map((ex, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background-primary/50 border"
          >
            <div className="text-sm">
              <div className="font-medium text-color-primary">
                {ex.name || "—"}
              </div>
              <div className="text-color-tertiary text-xs">
                {ex.weight ? `${ex.weight} kg • ` : ""}
                {ex.sets}×{ex.reps}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="inline-flex items-center gap-2 px-2 py-1 rounded border hover:bg-red-50 text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
