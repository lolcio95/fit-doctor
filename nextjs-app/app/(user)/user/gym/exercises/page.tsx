"use client";
import { useEffect, useState } from "react";
import ExerciseList from "./components/ExercisesList";
import ExerciseForm from "./components/ExercisesForm";
import { List } from "lucide-react";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/exercises");
      const data = await res.json();
      setExercises(data ?? []);
    } catch (err) {
      console.error("fetchExercises error", err);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <section className="bg-background-primary py-16 px-0 lg:px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-color-secondary flex items-center gap-3">
            <List className="w-6 h-6 text-color-primary" />
            Moje ćwiczenia
          </h1>
          <p className="text-color-tertiary mt-2 max-w-2xl">
            Dodawaj i zarządzaj ćwiczeniami — możesz edytować nazwy, opisy oraz
            usuwać niepotrzebne pozycje.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-background-card shadow-sm">
              <h2 className="text-lg font-semibold text-color-primary mb-4">
                Dodaj nowe ćwiczenie
              </h2>
              <ExerciseForm onExerciseAdded={fetchExercises} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-background-card shadow-sm">
              <h2 className="text-lg font-semibold text-color-primary mb-4">
                Lista ćwiczeń
              </h2>
              <ExerciseList
                exercises={exercises}
                loading={loading}
                onExerciseUpdated={fetchExercises}
                onExerciseDeleted={fetchExercises}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
