"use client";

import React, { useMemo } from "react";

export default function BMI({
  height,
  weight,
}: {
  height: number | null;
  weight: number | null;
}) {
  const { bmi, label } = useMemo(() => {
    if (!height || !weight) return { bmi: null, label: "Brak danych" };
    const h = Number(height) / 100;
    if (h <= 0) return { bmi: null, label: "Brak danych" };
    const value = weight / (h * h);
    const rounded = Math.round(value * 10) / 10;
    let l = "Nieznane";
    if (value < 18.5) l = "Niedowaga";
    else if (value < 25) l = "Waga prawidłowa";
    else if (value < 30) l = "Nadwaga";
    else l = "Otyłość";
    return { bmi: rounded, label: l };
  }, [height, weight]);

  return (
    <div>
      <div className="inline-flex items-baseline gap-2">
        <div className="text-2xl font-semibold">{bmi ?? "—"}</div>
        <div className="text-sm text-gray-500">BMI</div>
      </div>
      <div className="text-sm text-gray-300 mt-1">{label}</div>
    </div>
  );
}
