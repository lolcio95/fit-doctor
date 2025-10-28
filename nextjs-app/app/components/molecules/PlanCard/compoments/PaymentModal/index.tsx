import React, { useEffect, useState } from "react";
import { Button } from "@/app/components/atoms/Button";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  // phone is required now
  onOneTime: (phone: string) => void | Promise<void>;
  onSubscription: (phone: string) => void | Promise<void>;
};

type FormValues = {
  email: string;
  phone: string;
};

/**
 * Format display:
 * - If user types starting with '+', keep '+' and group remaining digits as "+CC XXX XXX ..."
 * - If no '+', group digits in sets of 3: "600 000 000"
 *
 * Normalization for sending:
 * - If starts with '+': return '+' + digits
 * - Else: assume polish national number -> return '+48' + digits
 */

const formatDisplayPhone = (raw: string) => {
  if (!raw) return "";
  const hasPlus = raw.trim().startsWith("+");
  // keep only digits for grouping
  const digits = raw.replace(/\D/g, "");
  if (hasPlus) {
    // assume first two digits country code for nicer layout if available
    if (digits.length <= 2) return `+${digits}`;
    const cc = digits.slice(0, 2);
    const rest = digits.slice(2);
    const groupedRest = rest.match(/.{1,3}/g)?.join(" ") ?? rest;
    return `+${cc}${groupedRest ? " " + groupedRest : ""}`;
  } else {
    // national grouping: groups of 3 from start
    const grouped = digits.match(/.{1,3}/g)?.join(" ") ?? digits;
    return grouped;
  }
};

const normalizePhoneForSending = (
  display: string | undefined
): string | undefined => {
  if (!display) return undefined;
  const trimmed = display.trim();
  if (!trimmed) return undefined;
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return undefined;
  if (hasPlus) {
    // return + and digits
    return `+${digits}`;
  } else {
    // assume Poland if no +
    return `+48${digits}`;
  }
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  loading,
  error,
  onOneTime,
  onSubscription,
}) => {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: "", phone: "" },
  });

  const phoneValue = watch("phone");

  // register validation rules for phone (required + digit length)
  const phoneRegister = register("phone", {
    required: "Numer telefonu jest wymagany",
    validate: (value: string) => {
      const digits = value?.replace(/\D/g, "") ?? "";
      if (!digits) return "Numer telefonu jest wymagany";
      if (digits.length < 7) return "Numer musi mieć co najmniej 7 cyfr";
      if (digits.length > 15) return "Numer jest zbyt długi";
      return true;
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }

    const abortController = new AbortController();
    setIsDataLoading(true);
    fetch("/api/user/me", { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setValue("email", data.user.email ?? "");
          setValue(
            "phone",
            data.user.phone ? formatDisplayPhone(data.user.phone) : ""
          );
        }
      })
      .catch((err) => {
        console.warn("Unable to fetch user data for PaymentModal:", err);
      })
      .finally(() => {
        setIsDataLoading(false);
      });

    return () => abortController.abort();
  }, [isOpen, reset, setValue]);

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
            disabled={loading || isSubmitting}
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-color-primary mb-4">
          Możesz zapłacić jednorazowo lub wykupić comiesięczną subskrypcję.
        </p>
        {isDataLoading ? (
          <div className="flex items-center justify-center w-full">
            <Loader2 className="animate-spin text-color-tertiary" />
          </div>
        ) : (
          <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4 space-y-2">
              <label className="text-xs text-color-tertiary">Email</label>
              <input
                className="w-full rounded p-2 bg-gray-600 text-sm"
                {...register("email")}
                disabled
                readOnly
              />

              <label className="text-xs text-color-tertiary mt-2">
                Numer telefonu (wymagany)
              </label>
              <input
                className="w-full rounded p-2 text-sm border"
                {...phoneRegister}
                value={phoneValue ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const formatted = formatDisplayPhone(raw);
                  setValue("phone", formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                placeholder="np. 600 000 000 (lub +48 600 000 000)"
                inputMode="tel"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Button
                  text={
                    loading || isSubmitting
                      ? "Przekierowuję..."
                      : "Płatność jednorazowa"
                  }
                  className="w-full"
                  variant="default"
                  onClick={handleSubmit(({ phone }) => {
                    // phone is required by validation; normalize and send
                    const normalized = normalizePhoneForSending(phone);
                    if (!normalized) {
                      // fallback safety
                      // eslint-disable-next-line no-alert
                      alert("Niepoprawny numer telefonu.");
                      return;
                    }
                    void onOneTime(normalized);
                  })}
                  disabled={loading || isSubmitting}
                />
                <Button
                  text={
                    loading || isSubmitting
                      ? "Przekierowuję..."
                      : "Płatność cykliczna (subskrypcja)"
                  }
                  className="w-full"
                  variant={"outline"}
                  onClick={handleSubmit(({ phone }) => {
                    const normalized = normalizePhoneForSending(phone);
                    if (!normalized) {
                      // eslint-disable-next-line no-alert
                      alert("Niepoprawny numer telefonu.");
                      return;
                    }
                    void onSubscription(normalized);
                  })}
                  disabled={loading || isSubmitting}
                />
              </div>

              <div className="mt-2 text-right">
                <button
                  onClick={onClose}
                  className="text-sm text-color-tertiary underline"
                  disabled={loading || isSubmitting}
                >
                  Anuluj
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
