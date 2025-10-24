"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clipboard, Calendar } from "lucide-react";
import TrainingList from "./components/TrainingList";
import Modal from "@/app/components/organisms/Modal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | React.ReactNode>("");
  const [modalDesc, setModalDesc] = useState<string | React.ReactNode>("");
  const [modalPrimaryAction, setModalPrimaryAction] = useState<() => void>(
    () => () => {}
  );
  const [activeTraining, setActiveTraining] = useState<Training | null>(null);

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
      const list = Array.isArray(data) ? data : [];
      setTrainings(list);
      const active =
        list.find((t: Training) => t.status === "IN_PROGRESS") ?? null;
      setActiveTraining(active);
    } catch (err: any) {
      setError(err?.message || "Błąd sieciowy");
      setTrainings([]);
      setActiveTraining(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const handleCreateAndEdit = async () => {
    if (activeTraining) {
      setModalTitle("Jest już aktywny trening");
      setModalDesc(
        `Masz aktywny trening z ${new Date(
          activeTraining.date
        ).toLocaleDateString(
          "pl-PL"
        )}. Najpierw zakończ go, aby utworzyć nowy trening.`
      );
      setModalPrimaryAction(() => () => {
        // navigate to active training edit
        router.push(`/user/gym/trainings/edit/${activeTraining.id}`);
      });
      setModalOpen(true);
      return;
    }

    setError(null);
    setCreating(true);
    try {
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
      router.push(`/user/gym/trainings/edit/${id}`);
    } catch (err) {
      console.error("create training error", err);
      setError("Błąd sieciowy. Spróbuj ponownie.");
      setCreating(false);
    }
  };

  return (
    <section className="bg-background-primary py-16 px-0 lg:px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-color-secondary flex items-center gap-3">
            <Clipboard className="w-6 h-6 text-color-primary" />
            Moje treningi
          </h1>
          <p className="text-color-tertiary mt-2 max-w-2xl">
            Dodawaj, edytuj i zarządzaj swoimi sesjami treningowymi. Możesz
            szybko stworzyć nowy trening, edytować go lub zakończyć sesję.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 p-6 rounded-2xl bg-background-card shadow-sm">
            <h2 className="text-lg font-semibold text-color-primary mb-4">
              Szybkie akcje
            </h2>

            <div className="flex flex-col gap-3">
              {/* "Dodaj trening" teraz uruchamia create-and-edit (link /add is unused) */}
              <button
                onClick={handleCreateAndEdit}
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-color-primary text-background-primary hover:opacity-95 disabled:opacity-60"
              >
                <Calendar className="w-4 h-4" />
                {creating ? "Tworzę..." : "Dodaj trening"}
              </button>

              <button
                onClick={fetchTrainings}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-background-primary"
              >
                Odśwież listę
              </button>

              {error && <div className="text-red-600 mt-2">{error}</div>}
            </div>
          </aside>

          <main className="lg:col-span-2 p-6 rounded-2xl bg-background-card shadow-sm">
            <h2 className="text-lg font-semibold text-color-primary mb-4">
              Lista treningów
            </h2>

            <TrainingList
              trainings={trainings}
              loading={loading}
              onRefresh={fetchTrainings}
            />
          </main>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        description={modalDesc}
        primaryLabel="Przejdź do aktywnego"
        onPrimary={() => {
          try {
            modalPrimaryAction();
          } finally {
            setModalOpen(false);
          }
        }}
        secondaryLabel="Anuluj"
        onSecondary={() => setModalOpen(false)}
      />
    </section>
  );
}
