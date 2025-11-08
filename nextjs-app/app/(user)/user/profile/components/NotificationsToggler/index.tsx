"use client";
import React, { useState } from "react";

export interface NotificationsTogglerProps {
  notificationsEnabled: boolean | null;
  setNotificationsEnabled: (isEnabled: boolean) => void;
}

export const NotificationsToggler = ({
  notificationsEnabled,
  setNotificationsEnabled,
}: NotificationsTogglerProps) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleNotifications = async () => {
    if (notificationsEnabled === null || saving) return;
    const newVal = !notificationsEnabled;

    // optimistic update
    setNotificationsEnabled(newVal);
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationsEnabled: newVal }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update settings");
      }
      // optionally read response
      await res.json();
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Błąd zapisu");
      // rollback optimistic update
      setNotificationsEnabled(!newVal);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-background-card p-4 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Powiadomienia</div>
          <div className="text-xs text-gray-500">
            Włącz lub wyłącz powiadomienia dla konta
          </div>
          {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        </div>
        <div>
          <button
            onClick={toggleNotifications}
            disabled={saving || notificationsEnabled === null}
            aria-pressed={Boolean(notificationsEnabled)}
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
              notificationsEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform bg-white rounded-full shadow transition-transform ${
                notificationsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
