"use client";
import React, { useState } from "react";

const OPTIONS = [
  { label: "Nieobsłużony", value: "TO_PROCESS" },
  { label: "W trakcie", value: "PROCESSING" },
  { label: "Obsłużone", value: "PROCESSED" },
];

const STATUS_CLASSES: Record<string, string> = {
  TO_PROCESS: "bg-red-300 text-red-800 border-red-200",
  PROCESSING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSED: "bg-green-100 text-green-800 border-green-200",
};

interface Props {
  initialStatus: string;
  paymentId: string;
}

export default function PaymentStatusSelect({
  initialStatus,
  paymentId,
}: Props) {
  const [status, setStatus] = useState<string>(initialStatus ?? "TO_PROCESS");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setSaving(true);
    setError(null);
    // optimistic update
    const prev = status;
    setStatus(newStatus);
    try {
      const res = await fetch(`/api/admin/orders/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update status");
      }
      const json = await res.json();
      setStatus(json.payment?.orderStatus ?? newStatus);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Błąd zapisu");
      setStatus(prev);
    } finally {
      setSaving(false);
    }
  };

  const statusClass = STATUS_CLASSES[status] ?? STATUS_CLASSES["TO_PROCESS"];

  return (
    <div className="flex flex-col items-end">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className={`rounded px-3 py-2 text-sm w-full sm:w-auto border ${statusClass} focus:outline-none`}
        aria-label="Zmień status zamówienia"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {saving && (
        <div className="text-xs text-gray-500 mt-1">Zapisywanie...</div>
      )}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}
