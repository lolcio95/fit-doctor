import React from "react";
import { Button } from "@/app/components/atoms/Button";
import { Loader2 } from "lucide-react";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  // akceptujemy zarówno synchroniczne jak i asynchroniczne handlery
  onOneTime: () => void | Promise<void>;
  onSubscription: () => void | Promise<void>;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  loading,
  error,
  onOneTime,
  onSubscription,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-lg bg-background-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">Wybierz metodę płatności</h4>
          <button
            onClick={onClose}
            aria-label="Zamknij"
            className="text-color-tertiary hover:opacity-80"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-color-primary mb-4">
          Możesz zapłacić jednorazowo lub wykupić comiesięczną subskrypcję.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Button
              text={loading ? "Przekierowuję..." : "Płatność jednorazowa"}
              className="w-full"
              variant="default"
              // użycie void zapobiega "unhandled promise" w ESLint jeśli onOneTime jest async
              onClick={() => void onOneTime()}
              disabled={loading}
            />
            <Button
              text={
                loading
                  ? "Przekierowuję..."
                  : "Płatność cykliczna (subskrypcja)"
              }
              className="w-full"
              variant={"outline"}
              onClick={() => void onSubscription()}
              disabled={loading}
            />
          </div>

          <div className="mt-2 text-right">
            <button
              onClick={onClose}
              className="text-sm text-color-tertiary underline"
              disabled={loading}
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
