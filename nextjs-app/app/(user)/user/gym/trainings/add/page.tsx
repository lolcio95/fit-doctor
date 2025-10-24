"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TrainingExerciseInput from "../components/TrainingExerciseInput";

type TrainingExerciseForm = {
  exerciseId: string;
  name: string;
  weight?: string;
  sets: string;
  reps: string;
};

export default function AddTrainingPage() {
  const router = useRouter();
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [exercises, setExercises] = useState<any[] | null>(null); // null = loading, [] = none
  const [selectedExercises, setSelectedExercises] = useState<
    TrainingExerciseForm[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setExercises(null);
    fetch("/api/exercises")
      .then((res) => {
        if (!res.ok) throw new Error("Błąd podczas pobierania ćwiczeń");
        return res.json();
      })
      .then((data) => {
        if (mounted) setExercises(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setExercises([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedExercises.length) {
      setError("Dodaj przynajmniej jedno ćwiczenie do treningu!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, exercises: selectedExercises }),
      });
      setLoading(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Błąd przy dodawaniu treningu");
        return;
      }
      router.push("/user/gym/trainings");
    } catch (err) {
      setLoading(false);
      setError("Błąd sieciowy. Spróbuj ponownie.");
    }
  };

  if (exercises === null) {
    return (
      <section>
        <h2>Dodaj trening</h2>
        <p>Ładowanie ćwiczeń...</p>
      </section>
    );
  }

  if (Array.isArray(exercises) && exercises.length === 0) {
    return (
      <section>
        <h2>Dodaj trening</h2>
        <div
          style={{
            background: "#111",
            color: "#fff",
            padding: 12,
            borderRadius: 6,
          }}
        >
          <p>Nie masz jeszcze żadnych ćwiczeń w swojej bazie.</p>
          <p>
            Aby dodać trening, najpierw dodaj ćwiczenia. Przejdź do strony{" "}
            <Link
              href="/user/gym/exercises"
              style={{ color: "#7cc0ff", textDecoration: "underline" }}
            >
              Dodaj ćwiczenia
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2>Dodaj trening</h2>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Data treningu:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            required
            style={{ marginLeft: 8 }}
          />
        </label>

        <TrainingExerciseInput
          exercises={exercises}
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
        />

        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          Zapisz zmiany
        </button>
      </form>
    </section>
  );
}
