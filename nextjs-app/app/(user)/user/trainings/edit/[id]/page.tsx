"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TrainingExerciseInput from "../../components/TrainingExerciseInput";
import Link from "next/link";

type TrainingExerciseForm = {
  exerciseId: string;
  name: string;
  weight?: string;
  sets: string;
  reps: string;
};

export default function EditTrainingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [exercises, setExercises] = useState<any[]>([]); // user's exercise library
  const [selectedExercises, setSelectedExercises] = useState<
    TrainingExerciseForm[]
  >([]);

  useEffect(() => {
    if (!id) {
      setError("Brak identyfikatora treningu w URL.");
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchTraining = async () => {
      try {
        const [tRes, eRes] = await Promise.all([
          fetch(`/api/trainings/${id}`),
          fetch("/api/exercises"),
        ]);
        if (!tRes.ok) {
          const tData = await tRes.json().catch(() => ({}));
          throw new Error(tData?.error || "Brak dostępu do treningu");
        }
        const tData = await tRes.json();
        const eData = await eRes.json();

        if (!mounted) return;
        // set date (format yyyy-mm-dd)
        const d = new Date(tData.date);
        setDate(d.toISOString().split("T")[0]);

        // populate selectedExercises from training.exercises
        setSelectedExercises(
          (tData.exercises || []).map((te: any) => ({
            exerciseId: te.exerciseId,
            name: te.exercise?.name ?? "",
            weight: te.weight != null ? String(te.weight) : "",
            sets: String(te.sets),
            reps: String(te.reps),
          }))
        );

        setExercises(Array.isArray(eData) ? eData : []);
        setLoading(false);
      } catch (err) {
        console.error("fetchTraining error:", err);
        if (!mounted) return;
        setError("Nie można wczytać treningu.");
        setLoading(false);
      }
    };
    fetchTraining();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedExercises.length) {
      setError("Trening musi zawierać przynajmniej jedno ćwiczenie.");
      return;
    }
    if (!id) {
      setError("Brak identyfikatora treningu.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/trainings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          exercises: selectedExercises.map((s) => ({
            exerciseId: s.exerciseId,
            weight: s.weight,
            sets: parseInt(s.sets, 10),
            reps: parseInt(s.reps, 10),
          })),
        }),
      });
      setSaving(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Błąd przy zapisywaniu zmian");
        return;
      }
      // navigate back to list and ensure list refetches (parent page handles refetch)
      router.push("/user/trainings");
    } catch (err) {
      console.error("handleSave error:", err);
      setSaving(false);
      setError("Błąd sieciowy.");
    }
  };

  if (loading) return <p>Ładowanie treningu...</p>;
  if (error)
    return (
      <section>
        <p style={{ color: "red" }}>{error}</p>
        <Link href="/user/trainings">
          <button>Powrót</button>
        </Link>
      </section>
    );

  return (
    <section>
      <h2>Edytuj trening</h2>
      <form onSubmit={handleSave}>
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

        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/user/trainings")}
            style={{ marginLeft: 8 }}
          >
            Anuluj
          </button>
        </div>
      </form>
    </section>
  );
}
