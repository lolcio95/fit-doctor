"use client";

import React, { useEffect, useState, useRef } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldErrors,
  FieldArrayWithId,
} from "react-hook-form";

type TrainingExerciseForm = {
  exerciseId: string;
  name: string;
  weight: string;
  sets: string;
  reps: string;
};

type FormValues = {
  exercises: TrainingExerciseForm[];
};

export default function TrainingExerciseInput({
  exercises,
  control,
  register,
  errors,
}: {
  exercises: any[];
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  const { fields, append, remove, update } = useFieldArray<FormValues>({
    control,
    name: "exercises",
  });

  // Keep names in sync when exerciseId changes (optional convenience)
  useEffect(() => {
    fields.forEach((f, idx) => {
      if (f.exerciseId && !f.name) {
        const ex = exercises.find((e: any) => e.id === f.exerciseId);
        if (ex) {
          update(idx, { ...f, name: ex.name });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises, fields]);

  const handleAdd = (payload: {
    exerciseId: string;
    weight: string;
    sets: string;
    reps: string;
  }) => {
    const ex = exercises.find((e: any) => e.id === payload.exerciseId);
    append({
      exerciseId: payload.exerciseId,
      name: ex?.name ?? "",
      weight: payload.weight,
      sets: payload.sets,
      reps: payload.reps,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-color-primary">Ćwiczenia</h3>

      <AddExerciseRow exercises={exercises} onAdd={handleAdd} />

      <ul className="space-y-2">
        {fields.map((field: FieldArrayWithId<FormValues, "exercises">, idx) => (
          <li
            key={field.id}
            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background-primary/50 border"
          >
            <div className="text-sm">
              <div className="font-medium text-color-primary">
                {field.name || "—"}
              </div>
              <div className="text-color-tertiary text-xs">
                {field.weight ? `${field.weight} kg • ` : ""}
                {field.sets}×{field.reps}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Hidden inputs so react-hook-form + zod resolver receive values.
                  Detailed validation moves to zod schema in parent form. */}
              <input
                type="hidden"
                {...register(`exercises.${idx}.exerciseId` as const)}
                defaultValue={field.exerciseId}
              />
              <input
                type="hidden"
                {...register(`exercises.${idx}.name` as const)}
                defaultValue={field.name}
              />
              <input
                type="hidden"
                {...register(`exercises.${idx}.weight` as const)}
                defaultValue={field.weight}
              />
              <input
                type="hidden"
                {...register(`exercises.${idx}.sets` as const)}
                defaultValue={field.sets}
              />
              <input
                type="hidden"
                {...register(`exercises.${idx}.reps` as const)}
                defaultValue={field.reps}
              />

              <button
                type="button"
                onClick={() => remove(idx)}
                className="inline-flex items-center gap-2 px-2 py-1 rounded border hover:bg-red-50 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Global errors from form validation (zod resolver) */}
      <div className="text-sm text-red-600">
        {errors?.exercises && (errors.exercises as any).message}
      </div>
    </div>
  );
}

/* AddExerciseRow - searchable select: type to filter, show dropdown filtered by substring.
   Behavior:
   - Input is text for exercise name
   - When user types, filter exercises whose name includes substring (case-insensitive)
   - If input empty, dropdown shows all exercises
   - Clicking a suggestion selects it (sets hidden exerciseId) and sets the input value
   - Keyboard: Arrow keys and Enter support basic navigation and selection
   - Also shows inline validation errors under each input (no alerts)
*/
function AddExerciseRow({
  exercises,
  onAdd,
}: {
  exercises: any[];
  onAdd: (payload: {
    exerciseId: string;
    weight: string;
    sets: string;
    reps: string;
  }) => void;
}) {
  const [exerciseId, setExerciseId] = useState("");
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  // errors for each field in the adder row
  const [exerciseError, setExerciseError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [setsError, setSetsError] = useState<string | null>(null);
  const [repsError, setRepsError] = useState<string | null>(null);

  // dropdown UI state
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // same MIN_WEIGHT as schema in parent (keep consistent)
  const MIN_WEIGHT = 0.01;

  // Filter exercises by substring in name (case-insensitive). If input empty, return all.
  const filtered = exerciseNameInput.trim()
    ? exercises.filter((ex: any) =>
        String(ex.name)
          .toLowerCase()
          .includes(exerciseNameInput.trim().toLowerCase())
      )
    : exercises;

  useEffect(() => {
    // close dropdown on outside click
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlightIdx(-1);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // keyboard navigation for dropdown (ArrowUp/Down, Enter, Escape)
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      // select highlighted or first if none
      e.preventDefault();
      const idxToSelect = highlightIdx >= 0 ? highlightIdx : 0;
      const item = filtered[idxToSelect];
      if (item) {
        selectExercise(item);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightIdx(-1);
    }
  };

  const selectExercise = (item: any) => {
    setExerciseId(String(item.id));
    setExerciseNameInput(String(item.name));
    setOpen(false);
    setHighlightIdx(-1);
    // focus next input (weight)
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const validateAll = () => {
    let ok = true;
    // reset
    setExerciseError(null);
    setWeightError(null);
    setSetsError(null);
    setRepsError(null);

    if (!exerciseId) {
      setExerciseError("Wybierz ćwiczenie.");
      ok = false;
    }

    if (weight === "" || weight === undefined || weight === null) {
      setWeightError("Podaj ciężar (kg).");
      ok = false;
    } else if (/[eE]/.test(weight)) {
      setWeightError(
        "Nie używaj notacji wykładniczej, wpisz liczbę dziesiętną."
      );
      ok = false;
    } else if (!/^[0-9]+(\.[0-9]+)?$/.test(weight)) {
      setWeightError(
        "Nieprawidłowy format liczby (użyj kropki dla części ułamkowej)."
      );
      ok = false;
    } else {
      const w = Number(weight);
      if (Number.isNaN(w)) {
        setWeightError("Ciężar musi być liczbą.");
        ok = false;
      } else if (w < MIN_WEIGHT) {
        setWeightError(`Ciężar musi być co najmniej ${MIN_WEIGHT} kg.`);
        ok = false;
      }
    }

    if (!sets || !/^\d+$/.test(sets) || Number(sets) <= 0) {
      setSetsError("Podaj prawidłową liczbę serii (liczba naturalna > 0).");
      ok = false;
    }

    if (!reps || !/^\d+$/.test(reps) || Number(reps) <= 0) {
      setRepsError("Podaj prawidłową liczbę powtórzeń (liczba naturalna > 0).");
      ok = false;
    }

    return ok;
  };

  const handleAdd = () => {
    if (!validateAll()) return;
    onAdd({ exerciseId, weight, sets, reps });
    setExerciseId("");
    setExerciseNameInput("");
    setWeight("");
    setSets("");
    setReps("");
    // clear errors after successful add
    setExerciseError(null);
    setWeightError(null);
    setSetsError(null);
    setRepsError(null);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 relative">
          <label className="text-sm text-color-tertiary">Ćwiczenie</label>
          <input
            ref={inputRef}
            type="text"
            value={exerciseNameInput}
            onChange={(e) => {
              setExerciseNameInput(e.target.value);
              setExerciseError(null);
              setExerciseId(""); // clear id while typing
              setOpen(true);
              setHighlightIdx(0);
            }}
            onFocus={() => {
              setOpen(true);
              setHighlightIdx(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Wpisz nazwę ćwiczenia lub wybierz z listy"
            className={`w-full mt-1 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary ${
              exerciseError ? "border-red-400" : ""
            }`}
            aria-autocomplete="list"
            aria-expanded={open}
            aria-haspopup="listbox"
          />

          {/* dropdown */}
          {open && filtered.length > 0 && (
            <ul
              role="listbox"
              aria-label="Lista ćwiczeń"
              className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-background-primary p-1"
            >
              {filtered.map((ex: any, i: number) => (
                <li
                  key={ex.id}
                  role="option"
                  aria-selected={highlightIdx === i}
                  onMouseDown={(ev) => {
                    // use onMouseDown to prevent blur before click
                    ev.preventDefault();
                    selectExercise(ex);
                  }}
                  onMouseEnter={() => setHighlightIdx(i)}
                  className={`cursor-pointer rounded px-2 py-1 ${
                    highlightIdx === i
                      ? "bg-color-primary/20"
                      : "hover:bg-background-primary/30"
                  }`}
                >
                  <div className="text-sm">{ex.name}</div>
                  {ex.muscleGroup && (
                    <div className="text-xs text-color-tertiary mt-0.5">
                      {ex.muscleGroup}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {exerciseError && (
            <div className="text-sm text-red-600 mt-1">{exerciseError}</div>
          )}
        </div>

        <div className="w-28">
          <label className="text-sm text-color-tertiary">Ciężar (kg)</label>
          <input
            type="number"
            placeholder="kg"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setWeightError(null);
            }}
            min={MIN_WEIGHT}
            step="any"
            className={`w-full mt-1 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary ${
              weightError ? "border-red-400" : ""
            }`}
          />
          {weightError && (
            <div className="text-sm text-red-600 mt-1">{weightError}</div>
          )}
        </div>

        <div className="w-24">
          <label className="text-sm text-color-tertiary">Serie</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => {
              setSets(e.target.value);
              setSetsError(null);
            }}
            min={1}
            step={1}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`w-full mt-1 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary ${
              setsError ? "border-red-400" : ""
            }`}
          />
          {setsError && (
            <div className="text-sm text-red-600 mt-1">{setsError}</div>
          )}
        </div>

        <div className="w-28">
          <label className="text-sm text-color-tertiary">Powt./serię</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => {
              setReps(e.target.value);
              setRepsError(null);
            }}
            min={1}
            step={1}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`w-full mt-1 px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary ${
              repsError ? "border-red-400" : ""
            }`}
          />
          {repsError && (
            <div className="text-sm text-red-600 mt-1">{repsError}</div>
          )}
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-color-primary text-background-primary hover:opacity-95"
          >
            <PlusCircle className="w-4 h-4" />
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
}
