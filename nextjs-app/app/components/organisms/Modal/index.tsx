"use client";
import React from "react";

export default function Modal({
  open,
  title,
  description,
  primaryLabel = "OK",
  onPrimary,
  secondaryLabel = "Anuluj",
  onSecondary,
  onClose,
}: {
  open: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    onClose();
  };

  const handleSecondary = () => {
    if (onSecondary) onSecondary();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-md w-full bg-background-card rounded-2xl p-6 shadow-lg">
        {title && (
          <h3 className="text-lg font-semibold text-color-primary mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-color-tertiary mb-4">{description}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleSecondary}
            className="px-4 py-2 rounded-lg border hover:bg-background-primary"
          >
            {secondaryLabel}
          </button>
          <button
            onClick={handlePrimary}
            className="px-4 py-2 rounded-lg bg-color-primary text-background-primary"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
