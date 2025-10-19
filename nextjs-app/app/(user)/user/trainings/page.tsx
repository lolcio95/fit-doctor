"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import TrainingList from "./components/TrainingList";

type Training = {
  id: string;
  date: string;
  exercises: {
    id: string;
    exercise: { id?: string; name?: string };
    weight?: number | null;
    sets: number;
    reps: number;
  }[];
};

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trainings");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Błąd pobierania treningów");
      }
      const data = await res.json();
      setTrainings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Błąd sieciowy");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h1>Moje treningi</h1>
        <Link href="/user/trainings/add">
          <button type="button">Dodaj trening</button>
        </Link>
      </div>

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      <TrainingList
        trainings={trainings}
        loading={loading}
        onRefresh={fetchTrainings}
      />
    </section>
  );
}
