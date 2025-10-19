"use client";

import { useState } from "react";

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
    if (!exerciseId || !sets || !reps) return;
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
    <>
      <h3>Ćwiczenia</h3>
      <div style={{ marginBottom: 12 }}>
        <select
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
        >
          <option value="">Wybierz ćwiczenie</option>
          {exercises.map((ex: any) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Ciężar (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          min={0}
          style={{ width: 90, marginLeft: 8 }}
        />
        <input
          type="number"
          placeholder="Serie"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          min={1}
          style={{ width: 60, marginLeft: 8 }}
        />
        <input
          type="number"
          placeholder="Powt./serię"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          min={1}
          style={{ width: 80, marginLeft: 8 }}
        />
        <button
          type="button"
          style={{ marginLeft: 8 }}
          onClick={handleAddExercise}
        >
          Dodaj ćwiczenie
        </button>
      </div>
      <ul>
        {selectedExercises.map((ex, idx) => (
          <li key={idx}>
            {ex.name} | Ciężar: {ex.weight || "-"} kg | Serie: {ex.sets} |
            Powt.: {ex.reps}
            <button style={{ marginLeft: 8 }} onClick={() => handleRemove(idx)}>
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
