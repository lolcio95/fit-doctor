"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function ProgressChart({
  series,
  metric = "max",
}: {
  series: {
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
  }[];
  metric?: "max" | "avg" | "last" | "volume";
}) {
  const sorted = [...series].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const labels = sorted.map((s) => s.date);
  const dataPoints = sorted.map((s) => {
    if (metric === "volume") return s.volume ?? null;
    return metric === "max"
      ? (s.max ?? null)
      : metric === "avg"
        ? (s.avg ?? null)
        : (s.last ?? null);
  });

  const data = {
    labels,
    datasets: [
      {
        label: metric === "volume" ? "Objętość" : `Waga (${metric})`,
        data: dataPoints,
        borderColor: "rgba(59,130,246,0.9)",
        backgroundColor: "rgba(59,130,246,0.12)",
        spanGaps: true,
        tension: 0.2,
        pointRadius: 4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#9CA3AF" },
      },
      y: {
        ticks: { color: "#9CA3AF" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (ctx: any) {
            const idx = ctx.dataIndex;
            const s = sorted[idx];
            if (!s) return "";
            const val = dataPoints[idx] == null ? "—" : dataPoints[idx];
            const detail = s.weights
              .map((w) =>
                w.weight == null ? "—" : `${w.weight}kg (${w.sets}×${w.reps})`
              )
              .join(", ");
            return `${ctx.dataset.label}: ${val}\nSzczegóły: ${detail}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: 320 }}>
      <Line data={data} options={options} />
    </div>
  );
}
