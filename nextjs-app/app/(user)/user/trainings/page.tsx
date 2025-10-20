"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Training = {
  id: string;
  date: string;
  status?: string;
  exercises: {
    id: string;
    exercise: { id?: string; name?: string };
    weight?: number | null;
    sets: number;
    reps: number;
  }[];
};

export default function TrainingsPage() {
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [finishingId, setFinishingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  // Create training on the server and navigate to edit page
  const handleCreateAndEdit = async () => {
    setError(null);
    setCreating(true);
    try {
      // use today's date (yyyy-mm-dd)
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, status: "IN_PROGRESS" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Błąd przy tworzeniu treningu");
        setCreating(false);
        return;
      }
      const id = data?.id;
      if (!id) {
        setError("Serwer nie zwrócił id treningu.");
        setCreating(false);
        return;
      }
      // navigate to edit page for created training
      router.push(`/user/trainings/edit/${id}`);
    } catch (err) {
      console.error("create training error", err);
      setError("Błąd sieciowy. Spróbuj ponownie.");
      setCreating(false);
    }
  };

  const handleContinue = (id: string) => {
    router.push(`/user/trainings/edit/${id}`);
  };

  const handleFinishTraining = async (id: string) => {
    if (!confirm("Czy na pewno chcesz zakończyć ten trening?")) return;
    setFinishingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/trainings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DONE" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // show server message (e.g. "Masz już trening tego dnia!")
        setError(data.error || "Błąd przy kończeniu treningu");
      } else {
        // refresh list
        await fetchTrainings();
      }
    } catch (err) {
      console.error("finish training error", err);
      setError("Błąd sieciowy. Spróbuj ponownie.");
    } finally {
      setFinishingId(null);
    }
  };

  const handleDeleteTraining = async (id: string) => {
    // confirm and delete training
    const ok = confirm(
      "Na pewno usunąć trening? Ta operacja usunie także powiązane ćwiczenia w tej sesji."
    );
    if (!ok) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/trainings/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Błąd przy usuwaniu treningu");
      } else {
        // refresh list
        await fetchTrainings();
      }
    } catch (err) {
      console.error("delete training error", err);
      setError("Błąd sieciowy. Spróbuj ponownie.");
    } finally {
      setDeletingId(null);
    }
  };

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

        <div>
          <button
            type="button"
            onClick={handleCreateAndEdit}
            disabled={creating}
            style={{ marginRight: 8 }}
          >
            {creating ? "Tworzę..." : "Dodaj trening i edytuj"}
          </button>
        </div>
      </div>

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      {loading ? (
        <p>Ładowanie...</p>
      ) : trainings.length === 0 ? (
        <p>Brak treningów.</p>
      ) : (
        <ul>
          {trainings.map((t) => {
            const isInProgress = t.status === "IN_PROGRESS";
            const trainingDate = new Date(t.date).toLocaleDateString();
            return (
              <li
                key={t.id}
                style={{
                  marginBottom: 12,
                  padding: 8,
                  border: "1px solid #eee",
                  borderRadius: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{trainingDate}</strong>
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {t.exercises?.length ?? 0} ćwiczeń
                    </div>
                    {isInProgress && (
                      <div style={{ fontSize: 13, color: "#0b66a4" }}>
                        Sesja w toku
                      </div>
                    )}
                  </div>

                  <div>
                    {isInProgress ? (
                      <>
                        <button
                          onClick={() => handleContinue(t.id)}
                          style={{ marginRight: 8 }}
                        >
                          Kontynuuj trening
                        </button>
                        <button
                          onClick={() => handleFinishTraining(t.id)}
                          disabled={finishingId === t.id}
                          style={{
                            background: "#d9534f",
                            color: "#fff",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: 4,
                          }}
                        >
                          {finishingId === t.id
                            ? "Kończenie..."
                            : "Zakończ trening"}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href={`/user/trainings/edit/${t.id}`}>
                          <button style={{ marginRight: 8 }}>Edytuj</button>
                        </Link>
                        <button
                          onClick={() => handleDeleteTraining(t.id)}
                          disabled={deletingId === t.id}
                          style={{
                            background: "#d9534f",
                            color: "#fff",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: 4,
                          }}
                        >
                          {deletingId === t.id ? "Usuwanie..." : "Usuń"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
