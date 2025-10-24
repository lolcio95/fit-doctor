"use client";

import { useEffect, useRef, useState } from "react";
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
  const [autosaving, setAutosaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    TrainingExerciseForm[]
  >([]);
  const [status, setStatus] = useState<"IN_PROGRESS" | "DONE" | string>("DONE");

  const autosaveTimeout = useRef<number | null>(null);
  const autosaveController = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (autosaveTimeout.current) {
        window.clearTimeout(autosaveTimeout.current);
        autosaveTimeout.current = null;
      }
      if (autosaveController.current) {
        try {
          autosaveController.current.abort();
        } catch (_) {}
        autosaveController.current = null;
      }
    };
  }, []);

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
          const message =
            tData?.error ??
            `Błąd serwera (${tRes.status}) przy pobieraniu treningu.`;
          if (mounted) setError(message);
          setLoading(false);
          return;
        }

        const tData = await tRes.json();
        const eData = await eRes.json().catch(() => []);

        if (!mounted) return;

        // set date (format yyyy-mm-dd)
        const d = new Date(tData.date);
        setDate(d.toISOString().split("T")[0]);

        // set status
        setStatus(tData.status ?? "DONE");

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
      } catch (err: any) {
        console.error("fetchTraining error:", err);
        if (!mounted) return;
        setError(err?.message || "Nie można wczytać treningu.");
        setLoading(false);
      }
    };
    fetchTraining();
    return () => {
      mounted = false;
    };
  }, [id]);

  const clearPendingAutosave = () => {
    if (autosaveTimeout.current) {
      window.clearTimeout(autosaveTimeout.current);
      autosaveTimeout.current = null;
    }
    if (autosaveController.current) {
      try {
        autosaveController.current.abort();
      } catch (_) {}
      autosaveController.current = null;
    }
  };

  useEffect(() => {
    if (!id) return;
    if (status !== "IN_PROGRESS") return;

    if (autosaveTimeout.current) {
      window.clearTimeout(autosaveTimeout.current);
    }

    if (loading) return;

    autosaveTimeout.current = window.setTimeout(async () => {
      if (autosaveController.current) {
        try {
          autosaveController.current.abort();
        } catch (_) {}
        autosaveController.current = null;
      }

      const controller = new AbortController();
      autosaveController.current = controller;
      setAutosaving(true);
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
            status: "IN_PROGRESS",
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          // ignore aborted requests
          if (controller.signal.aborted) {
            // aborted intentionally
          } else {
            const data = await res.json().catch(() => ({}));
            console.warn("Autosave failed:", data.error || res.status);
          }
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          // expected when we aborted
        } else {
          console.error("Autosave error:", err);
        }
      } finally {
        if (mountedRef.current) setAutosaving(false);
        // clear controller reference if it's this one
        if (autosaveController.current === controller)
          autosaveController.current = null;
      }
    }, 600);

    return () => {
      if (autosaveTimeout.current) {
        window.clearTimeout(autosaveTimeout.current);
      }
    };
    // only watch selectedExercises, date, status, id
  }, [selectedExercises, date, status, id, loading]);

  const handleSaveManual = async (finalize = false) => {
    // Manual save used in DONE mode (or to finalize IN_PROGRESS -> DONE if finalize=true)
    if (!id) {
      setError("Brak identyfikatora treningu.");
      return false;
    }
    if (!selectedExercises.length && finalize) {
      setError("Dodaj przynajmniej jedno ćwiczenie do treningu!");
      return false;
    }
    setSaving(true);
    setError(null);
    try {
      clearPendingAutosave();

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
          status: finalize ? "DONE" : status,
        }),
      });
      setSaving(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Błąd przy zapisywaniu zmian");
        return false;
      }

      if (finalize) {
        setStatus("DONE");
      }

      return true;
    } catch (err) {
      console.error("handleSaveManual error:", err);
      setSaving(false);
      setError("Błąd sieciowy.");
      return false;
    }
  };

  const handleFinish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearPendingAutosave();

    setStatus("DONE");

    const success = await handleSaveManual(true);
    if (success) {
      router.push("/user/gym/trainings");
    } else {
      setStatus("IN_PROGRESS");
    }
  };

  const handleSaveChangesButton = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await handleSaveManual(false);
  };

  if (loading) return <p>Ładowanie treningu...</p>;
  if (error)
    return (
      <section>
        <p style={{ color: "red" }}>{error}</p>
        <Link href="/user/gym/trainings">
          <button>Powrót</button>
        </Link>
      </section>
    );

  return (
    <section>
      <h2>Edytuj trening</h2>

      <div style={{ marginBottom: 8 }}>
        <strong>Status:</strong> {status}
        {autosaving && (
          <span style={{ marginLeft: 8, color: "#666" }}>Autosaving...</span>
        )}
        {saving && (
          <span style={{ marginLeft: 8, color: "#666" }}>Zapisuję...</span>
        )}
      </div>

      <form
        onSubmit={
          status === "IN_PROGRESS" ? handleFinish : handleSaveChangesButton
        }
      >
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
          {status === "IN_PROGRESS" ? (
            <>
              <button
                type="button"
                onClick={handleFinish}
                disabled={autosaving || saving}
              >
                {saving ? "Zapisuję i kończę..." : "Zakończ trening"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/user/gym/trainings")}
                style={{ marginLeft: 8 }}
              >
                Anuluj
              </button>
            </>
          ) : (
            <>
              <button type="submit" disabled={saving}>
                {saving ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/user/gym/trainings")}
                style={{ marginLeft: 8 }}
              >
                Anuluj
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}
