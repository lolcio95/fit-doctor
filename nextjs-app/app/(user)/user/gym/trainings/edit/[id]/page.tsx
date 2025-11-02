"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TrainingExerciseInput from "../../components/TrainingExerciseInput";
import { Save, CheckSquare, Loader2, ArrowLeft } from "lucide-react";
import GenericModal from "@/app/components/organisms/Modal";
import { ButtonLink } from "@/app/components/atoms/ButtonLink";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type TrainingExerciseForm = {
  exerciseId: string;
  name: string;
  weight: string;
  sets: string;
  reps: string;
};

type FormValues = {
  date: string;
  status: "IN_PROGRESS" | "DONE" | string;
  exercises: TrainingExerciseForm[];
};

// Zod schema: weight required, float > MIN_WEIGHT, sets/reps natural >0, date required
const MIN_WEIGHT = 0.01;

const exerciseSchema = z.object({
  exerciseId: z.string().min(1, "Wybierz ćwiczenie"),
  name: z.string().optional(),
  weight: z
    .string()
    .nonempty("Podaj ciężar (kg)")
    .refine((s) => !/[eE]/.test(s), {
      message: "Nie używaj notacji wykładniczej",
    })
    .refine((s) => /^[0-9]+(\.[0-9]+)?$/.test(s), {
      message: "Nieprawidłowy format liczby",
    })
    .transform((s) => Number(s))
    .refine((n) => !Number.isNaN(n) && n >= MIN_WEIGHT, {
      message: `Ciężar musi być >= ${MIN_WEIGHT} kg`,
    }),
  sets: z
    .string()
    .nonempty("Podaj liczbę serii")
    .refine((s) => /^\d+$/.test(s) && Number(s) > 0, {
      message: "Serie muszą być liczbą naturalną > 0",
    }),
  reps: z
    .string()
    .nonempty("Podaj liczbę powtórzeń")
    .refine((s) => /^\d+$/.test(s) && Number(s) > 0, {
      message: "Powtórzenia muszą być liczbą naturalną > 0",
    }),
});

const schema = z.object({
  date: z.string().nonempty("Podaj datę treningu"),
  status: z.string(),
  exercises: z
    .array(exerciseSchema)
    .min(1, "Dodaj przynajmniej jedno ćwiczenie")
    .optional(), // optional here to allow empty array during editing; you can require at submit
});

export default function EditTrainingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autosaving, setAutosaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [exercisesList, setExercisesList] = useState<any[]>([]);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictTrainingId, setConflictTrainingId] = useState<string | null>(
    null
  );
  const [conflictMessage, setConflictMessage] = useState<string>("");

  const autosaveTimeout = useRef<number | null>(null);
  const autosaveController = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const {
    register,
    control,
    reset,
    setError: setFormError,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: "",
      status: "DONE",
      exercises: [],
    },
  });

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
        const dateIso = d.toISOString().split("T")[0];

        // prepare form values
        const formValues: FormValues = {
          date: dateIso,
          status: tData.status ?? "DONE",
          exercises: (tData.exercises || []).map((te: any) => ({
            exerciseId: te.exerciseId,
            name: te.exercise?.name ?? "",
            weight: te.weight != null ? String(te.weight) : "",
            sets: String(te.sets),
            reps: String(te.reps),
          })),
        };

        reset(formValues);
        setExercisesList(Array.isArray(eData) ? eData : []);
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
  }, [id, reset]);

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

  // autosave logic: watch relevant fields
  const watchedDate = useWatch({ control, name: "date" });
  const watchedExercises = useWatch({ control, name: "exercises" });
  const watchedStatus = useWatch({ control, name: "status" });

  useEffect(() => {
    if (!id) return;
    if (watchedStatus !== "IN_PROGRESS") return;

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
            date: watchedDate,
            exercises: (watchedExercises || []).map((s: any) => ({
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
          if (controller.signal.aborted) {
          } else {
            const data = await res.json().catch(() => ({}));
            console.warn("Autosave failed:", data.error || res.status);
          }
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
        } else {
          console.error("Autosave error:", err);
        }
      } finally {
        if (mountedRef.current) setAutosaving(false);
        if (autosaveController.current === controller)
          autosaveController.current = null;
      }
    }, 600);

    return () => {
      if (autosaveTimeout.current) {
        window.clearTimeout(autosaveTimeout.current);
      }
    };
  }, [watchedExercises, watchedDate, watchedStatus, id, loading]);

  const handleSaveManual = async (finalize = false) => {
    if (!id) {
      setError("Brak identyfikatora treningu.");
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
          date: watchedDate,
          exercises: (watchedExercises || []).map((s: any) => ({
            exerciseId: s.exerciseId,
            weight: s.weight,
            sets: parseInt(s.sets, 10),
            reps: parseInt(s.reps, 10),
          })),
          status: finalize ? "DONE" : watchedStatus,
        }),
      });
      setSaving(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Błąd przy zapisywaniu zmian");
        return false;
      }

      if (finalize) {
        reset(
          {
            date: watchedDate,
            status: "DONE",
            exercises: watchedExercises || [],
          },
          { keepDirty: false, keepTouched: false }
        );
      }

      return true;
    } catch (err) {
      console.error("handleSaveManual error:", err);
      setSaving(false);
      setError("Błąd sieciowy.");
      return false;
    }
  };

  const checkConflictForDate = async (targetDate: string) => {
    try {
      const res = await fetch("/api/trainings");
      if (!res.ok) return null;
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      const normalized = (d: any) => new Date(d).toISOString().split("T")[0];
      const found = list.find((t: any) => {
        if (!t?.date) return false;
        const sameDate = normalized(t.date) === normalized(targetDate);
        const differentId = !id || t.id !== id;
        return sameDate && differentId;
      });
      return found ?? null;
    } catch (err) {
      console.error("checkConflictForDate error", err);
      return null;
    }
  };

  const handleFinish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // run validation using react-hook-form + zod resolver
    const valid = await (async () => {
      try {
        const values = getValues(); // get current values
        // zod parse - will throw if invalid
        schema.parse(values);
        return true;
      } catch (zErr: any) {
        // map errors to form via setFormError
        if (zErr?.issues && Array.isArray(zErr.issues)) {
          zErr.issues.forEach((iss: any) => {
            // iss.path example: ["exercises", 0, "weight"]
            const path = iss.path;
            if (!path || path.length === 0) return;
            // construct field name
            const fieldName = path.join(".");
            setFormError(fieldName as any, {
              type: "manual",
              message: iss.message,
            });
          });
        }
        return false;
      }
    })();

    if (!valid) return;

    // check conflict
    const conflict = await checkConflictForDate(watchedDate);
    if (conflict) {
      setConflictTrainingId(conflict.id ?? null);
      setConflictMessage(
        `Na ${new Date(watchedDate).toLocaleDateString("pl-PL")} istnieje już trening. Najpierw zakończ tamten lub przejdź do niego.`
      );
      setConflictModalOpen(true);
      return;
    }

    clearPendingAutosave();

    // set status to DONE in form
    reset(
      {
        date: watchedDate,
        status: "DONE",
        exercises: watchedExercises || [],
      },
      { keepDirty: false, keepTouched: false }
    );

    const success = await handleSaveManual(true);
    if (success) {
      router.push("/user/gym/trainings");
    } else {
      // revert status back to IN_PROGRESS if save failed
      reset(
        {
          date: watchedDate,
          status: "IN_PROGRESS",
          exercises: watchedExercises || [],
        },
        { keepDirty: false, keepTouched: false }
      );
    }
  };

  const handleSaveChangesButton = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await handleSaveManual(false);
  };

  if (loading)
    return (
      <div className="min-h-[200px] flex items-center justify-center text-color-tertiary">
        Ładowanie treningu...
      </div>
    );

  return (
    <section className="min-h-screen bg-background-primary py-12 lg:px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-color-primary/80 to-color-primary/40" />
            <div>
              <h1 className="text-2xl font-semibold text-color-secondary">
                Edytuj trening
              </h1>
              <p className="text-sm text-color-tertiary mt-1">
                Edycja sesji — zmiany są autosave przy statusie{" "}
                <span className="font-semibold px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-800">
                  {watchedStatus === "IN_PROGRESS" ? "W TRAKCIE" : "ZAKOŃCZONY"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {autosaving && (
              <div className="inline-flex items-center gap-2 text-sm text-color-tertiary">
                <Loader2 className="w-4 h-4 animate-spin" />
                Zapisywanie...
              </div>
            )}
            {saving && (
              <div className="inline-flex items-center gap-2 text-sm text-color-tertiary">
                <Save className="w-4 h-4" />
                Zapisuję...
              </div>
            )}

            <button
              onClick={() => router.push("/user/gym/trainings")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-transparent border hover:bg-background-primary/30 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót
            </button>
          </div>
        </header>

        <form
          onSubmit={
            watchedStatus === "IN_PROGRESS"
              ? handleFinish
              : handleSaveChangesButton
          }
          className="p-6 rounded-2xl bg-background-card shadow-lg border"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <label className="col-span-1 sm:col-span-2">
              <div className="text-sm text-color-tertiary mb-1">
                Data treningu
              </div>
              <input
                {...register("date")}
                type="date"
                max={new Date().toISOString().split("T")[0]}
                required
                className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-color-primary"
              />
              {errors.date && (
                <div className="text-sm text-red-600 mt-1">
                  {(errors.date as any).message}
                </div>
              )}
            </label>

            <div className="flex flex-col items-start sm:items-end">
              <div className="text-sm text-color-tertiary">Status</div>
              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                    watchedStatus === "IN_PROGRESS"
                      ? "bg-yellow-200 text-yellow-900 border border-yellow-300"
                      : "bg-green-200 text-green-900 border border-green-300"
                  }`}
                >
                  {watchedStatus === "IN_PROGRESS" ? "W TRAKCIE" : "ZAKOŃCZONY"}
                </span>
              </div>
            </div>
          </div>

          {/* Exercise input + nice summary grid */}
          <div className="mt-6 space-y-4">
            {exercisesList.length ? (
              <TrainingExerciseInput
                exercises={exercisesList}
                //@ts-ignore
                control={control}
                //@ts-ignore
                register={register}
                errors={errors}
              />
            ) : (
              <div>
                <h3 className="text-lg font-bold">Brak ćwiczeń w bazie</h3>
                <p className="my-3 lg:my-4">
                  Przejdź do ćwiczeń aby dodać ćwiczenia do swojej bazy
                </p>
                <ButtonLink text="Dodaj ćwiczenia" href="/user/gym/exercises" />
              </div>
            )}
          </div>

          {error && <div className="text-red-600 mt-4">{error}</div>}

          <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
            {watchedStatus === "IN_PROGRESS" ? (
              <>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={autosaving || saving}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-color-primary to-color-primary/80 text-background-primary shadow-md disabled:opacity-60"
                >
                  <CheckSquare className="w-4 h-4" />
                  {saving ? "Zapisuję i kończę..." : "Zakończ trening"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/user/gym/trainings")}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-transparent hover:bg-background-primary/30"
                >
                  Anuluj
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-color-primary to-color-primary/80 text-background-primary shadow-md disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/user/gym/trainings")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-transparent hover:bg-background-primary/30"
                >
                  Anuluj
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      <GenericModal
        open={conflictModalOpen}
        onClose={() => setConflictModalOpen(false)}
        title="Trening już istnieje"
        description={conflictMessage}
        primaryLabel="Przejdź do istniejącego"
        onPrimary={() => {
          if (conflictTrainingId) {
            router.push(`/user/gym/trainings/edit/${conflictTrainingId}`);
          }
          setConflictModalOpen(false);
        }}
        secondaryLabel="Anuluj"
        onSecondary={() => setConflictModalOpen(false)}
      />
    </section>
  );
}
