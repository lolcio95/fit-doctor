"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Activity, X } from "lucide-react";
import ProgressChart from "./components/ProgressChart";
import MetricSelect from "./components/MetricsSelect";

type SeriesPoint = {
  date: string;
  weights: {
    weight?: number | null;
    sets: number;
    reps: number;
    volume: number;
  }[];
  max?: number | null;
  avg?: number | null;
  last?: number | null;
  volume?: number;
};

type SummaryItem = {
  id: string;
  name: string;
  entriesCount: number;
  lastEntry: {
    date: string;
    weight?: number | null;
    sets?: number;
    reps?: number;
  } | null;
  recent: {
    date: string;
    weight?: number | null;
    sets?: number;
    reps?: number;
  }[];
};

export default function ProgressPage() {
  const [items, setItems] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SummaryItem | null>(null);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<"max" | "avg" | "last" | "volume">(
    "max"
  );

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/progress");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Błąd pobierania danych.");
      setItems(json.items ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Błąd sieciowy.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openChart = async (item: SummaryItem) => {
    setSelected(item);
    setChartLoading(true);
    setSeries([]);
    try {
      const res = await fetch(
        `/api/progress?exerciseId=${encodeURIComponent(item.id)}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Błąd pobierania serii.");
      // Expecting API to return series as array of objects with date, weights[], max, avg, last, volume
      const s = (json.series ?? []) as SeriesPoint[];
      setSeries(s);
    } catch (err: any) {
      console.error(err);
      setSeries([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <section className="bg-background-primary py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <TrendingUp className="w-6 h-6 text-color-primary" />
          <div>
            <h1 className="text-3xl font-bold text-color-secondary">
              Progres ćwiczeń
            </h1>
            <p className="text-color-tertiary mt-1">
              Przeglądaj historię wag/serii dla każdego ćwiczenia.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-color-tertiary">
              Ładowanie...
            </div>
          ) : error ? (
            <div className="col-span-full text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-color-tertiary">
              Brak danych progresu. Dodaj pierwsze treningi.
            </div>
          ) : (
            items.map((it) => (
              <button
                key={it.id}
                onClick={() => openChart(it)}
                className="text-left p-4 rounded-2xl bg-background-card hover:shadow transition-shadow flex flex-col gap-2"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-color-primary" />
                    <div className="min-w-0">
                      <strong className="text-color-primary block truncate">
                        {it.name}
                      </strong>
                      <div className="text-xs text-color-tertiary truncate">
                        {it.lastEntry
                          ? `Ostatnio: ${it.lastEntry.weight ?? "—"} kg • ${it.lastEntry.date}`
                          : "Brak wpisów"}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-color-tertiary">
                    {it.entriesCount} wpisów
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chart modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setSelected(null);
                setSeries([]);
              }}
            />
            <div className="relative z-10 w-full max-w-3xl bg-background-card rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-color-primary mb-1">
                    {selected.name} — Progres
                  </h2>
                  <div className="text-sm text-color-tertiary">
                    Wybierz widok i zobacz szczegóły serii z sesji.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelected(null);
                      setSeries([]);
                    }}
                    className="p-2 rounded-md hover:bg-background-primary"
                    aria-label="Zamknij"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-color-tertiary">
                    Metryka:
                  </label>
                  <MetricSelect value={metric} onChange={(v) => setMetric(v)} />
                </div>

                <div className="text-sm text-color-tertiary">
                  Punkty: {series.length}
                </div>
              </div>

              <div className="mb-4">
                {chartLoading ? (
                  <div className="text-color-tertiary">
                    Ładowanie wykresu...
                  </div>
                ) : series.length === 0 ? (
                  <div className="text-color-tertiary">
                    Brak danych do wykresu.
                  </div>
                ) : (
                  <ProgressChart series={series} metric={metric} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
