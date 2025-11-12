"use client";

import React, { useRef, useMemo, useLayoutEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Chart,
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

type WeightEntry = { weight?: number | null; recordedAt: string };

export default function WeightChart({ weights }: { weights: WeightEntry[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const resizeTimer = useRef<number | null>(null);

  const sorted = useMemo(
    () =>
      [...weights].sort(
        (a, b) =>
          new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
      ),
    [weights]
  );

  const labels = useMemo(
    () => sorted.map((w) => w.recordedAt.slice(0, 10)),
    [sorted]
  );
  const dataPoints = useMemo(
    () => sorted.map((w) => (w.weight == null ? null : w.weight)),
    [sorted]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Waga (kg)",
          data: dataPoints,
          borderColor: "rgba(59,130,246,0.9)",
          backgroundColor: "rgba(59,130,246,0.12)",
          spanGaps: true,
          tension: 0.2,
          pointRadius: 4,
        },
      ],
    }),
    [labels, dataPoints]
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const computeTicks = () => {
      const width = el.clientWidth || 0;
      // approximate characters per tick; adjust if needed
      const approxPerTickPx = 50; // smaller than before - we shortened labels
      const estimated = Math.max(2, Math.floor(width / approxPerTickPx));
      return Math.min(8, estimated); // clamp
    };

    const applyResize = () => {
      try {
        const chart = chartRef.current?.chartInstance ?? chartRef.current;
        if (!chart) return;

        // update maxTicksLimit dynamically
        const maxTicks = computeTicks();
        if (
          chart.options &&
          chart.options.scales &&
          chart.options.scales.x &&
          chart.options.scales.x.ticks
        ) {
          chart.options.scales.x.ticks.maxTicksLimit = maxTicks;
        } else if (chart.config && chart.config.options) {
          // fallback
          chart.config.options.scales = chart.config.options.scales || {};
          chart.config.options.scales.x = chart.config.options.scales.x || {};
          chart.config.options.scales.x.ticks =
            chart.config.options.scales.x.ticks || {};
          chart.config.options.scales.x.ticks.maxTicksLimit = maxTicks;
        }

        // enforce canvas full width
        if (chart.canvas) {
          chart.canvas.style.width = "100%";
          chart.canvas.style.maxWidth = "100%";
        }

        // call resize/update
        if (typeof chart.resize === "function") chart.resize();
        if (typeof chart.update === "function") chart.update();
      } catch (e) {
        // ignore
      }
    };

    const debounced = () => {
      if (resizeTimer.current) {
        window.clearTimeout(resizeTimer.current);
      }
      resizeTimer.current = window.setTimeout(() => {
        applyResize();
        resizeTimer.current = null;
      }, 100);
    };

    // initial apply
    applyResize();

    const ro = new ResizeObserver(() => debounced());
    ro.observe(el);

    window.addEventListener("resize", debounced);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", debounced);
      if (resizeTimer.current) {
        window.clearTimeout(resizeTimer.current);
        resizeTimer.current = null;
      }
    };
  }, []);

  const options: any = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          ticks: {
            color: "#9CA3AF",
            autoSkip: true,
            maxTicksLimit: 6,
            maxRotation: 0,
          },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#9CA3AF" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const idx = ctx.dataIndex;
              const val =
                dataPoints[idx] == null ? "—" : `${dataPoints[idx]} kg`;
              return `${ctx.dataset.label}: ${val}`;
            },
          },
        },
      },
    }),
    [dataPoints]
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "14rem",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
      className="md:h-80"
    >
      {/* Strong CSS overrides to prevent canvas overflow */}
      <style>{`
        .chartjs-render-monitor, canvas {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
      `}</style>

      <Line
        // el może być wrapper z chartInstance (starsze wersje) lub bezpośrednio Chart (nowsze)
        ref={(el) => {
          // jeśli el ma chartInstance (wrapper), weź el.chartInstance, inaczej traktuj el jako Chart
          chartRef.current =
            (el as any)?.chartInstance ??
            (el as unknown as Chart<"line", (number | null)[], unknown>);
        }}
        data={data}
        options={options}
      />
    </div>
  );
}
