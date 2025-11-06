import React from "react";
import { Button } from "@/app/components/atoms/Button";

export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  error: boolean;
  title?: string;
  text?: string;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  error,
  title,
  text,
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
          <h4 className="text-lg font-bold">{title}</h4>
        </div>

        {error ? (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {text}
          </div>
        ) : (
          <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-600">
            {text}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            text={"OK"}
            className="px-4 py-2"
            variant="default"
            onClick={() => void onClose()}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
