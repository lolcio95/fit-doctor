import React from "react";
import { Button } from "@/app/components/atoms/Button";

export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  // akceptujemy zarówno synchroniczne jak i asynchroniczne potwierdzenia
  onConfirm: () => void | Promise<void>;
  title?: string;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  loading,
  error,
  onConfirm,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-lg bg-background-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">Potwierdź aktualizację</h4>
        </div>

        <p className="text-sm text-color-primary mb-4">
          Czy na pewno chcesz zaktualizować swój plan na &quot;{title}&quot;?
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-transparent text-color-tertiary underline"
            disabled={loading}
          >
            Anuluj
          </button>
          <Button
            // użycie void aby nie zostawiać nieobsłużonego Promise'a
            text={loading ? "Aktualizuję..." : "OK"}
            className="px-4 py-2"
            variant="default"
            onClick={() => void onConfirm()}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
