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
 * Behavior:
 * - While typing allow leading '+' and preserve input for non-+48 codes (don't aggressively reformat).
 * - For +48 format as "+48 123 456 789".
 * - On submit validate only two accepted formats:
 *   * "+48 123 456 789"
 *   * "123 456 789"
 * - If no + provided on submit, assume +48 when normalizing for sending.
 */

const group3 = (s: string) => {
  if (!s) return "";
  return s.match(/.{1,3}/g)?.join(" ") ?? s;
};

const formatDisplayPhone = (raw: string) => {
  if (raw == null) return "";
  const trimmed = raw.trim();

  // preserve leading plus while typing, but format digits in groups of 3 for +48
  const hasPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (hasPlus) {
    // If no digits yet, keep the plus so user can type it
    if (!digitsOnly) return "+";

    // If digits start with 48 -> format as Polish number
    if (digitsOnly.startsWith("48")) {
      const rest = digitsOnly.slice(2, 11); // up to 9 national digits
      const groupedRest = group3(rest);
      return `+48${groupedRest ? " " + groupedRest : ""}`;
    }

    // For other country codes: preserve user's spacing as much as possible.
    // Remove any characters other than digits and spaces from the part after '+',
    // collapse multiple spaces to single space and trim.
    const afterPlus = raw
      .replace(/^\+/, "") // remove leading + (we'll add it back)
      .replace(/[^\d\s]/g, "") // keep only digits and spaces
      .replace(/\s+/g, " ")
      .trim();

    return `+${afterPlus}`;
  } else {
    // national formatting: up to 9 digits grouped by 3
    const national = digitsOnly.slice(0, 9);
    return group3(national);
  }
};

const normalizePhoneForSending = (
  display: string | undefined
): string | undefined => {
  if (!display) return undefined;
  const trimmed = display.trim();
  if (!trimmed) return undefined;

  // Remove spaces
  const noSpaces = trimmed.replace(/\s+/g, "");
  const hasPlus = noSpaces.startsWith("+");
  const digits = noSpaces.replace(/\D/g, "");
  if (!digits) return undefined;

  if (hasPlus) {
    // only accept +48... here because display validation enforces +48 if plus used
    if (!digits.startsWith("48")) return undefined;
    return `+${digits}`;
  } else {
    // assume Poland if no +
    return `+48${digits}`;
  }
};

// Accept either exactly +48 then 9 digits (spaces optional) or 9 digits (spaces optional).
const phoneDisplayRegex =
  /^(?:\+48\s?\d{3}\s?\d{3}\s?\d{3}|\d{3}\s?\d{3}\s?\d{3})$/;

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
    // default react-hook-form mode is onSubmit, so validation will run on submit
  });

  const phoneValue = watch("phone");

  // register validation rules for phone (required + exact format) — validation runs on submit
  const phoneRegister = register("phone", {
    required: "Numer telefonu jest wymagany",
    validate: (value: string) => {
      const v = (value ?? "").trim();
      if (!v) return "Numer telefonu jest wymagany";
      // Accept only two formats on submit: "+48 123 456 789" or "123 456 789"
      if (!phoneDisplayRegex.test(v)) {
        return "Numer telefonu może być napisany tylko w takim formacie +48 123 456 789 lub 123 456 789";
      }
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
                  // Format input live and preserve leading '+' while typing.
                  // IMPORTANT: do not validate during typing -> shouldValidate: false
                  const formatted = formatDisplayPhone(raw);
                  setValue("phone", formatted, {
                    shouldValidate: false,
                    shouldDirty: true,
                  });
                }}
                placeholder="+48 123 456 789 lub 123 456 789"
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
                    // phone validation runs here (on submit). normalize and send
                    const normalized = normalizePhoneForSending(phone);
                    if (!normalized) {
                      // fallback safety
                      // eslint-disable-next-line no-alert
                      alert(
                        "Niepoprawny numer telefonu. Numer telefonu może być napisany tylko w takim formacie +48 123 456 789 lub 123 456 789"
                      );
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
                      alert(
                        "Niepoprawny numer telefonu. Numer telefonu może być napisany tylko w takim formacie +48 123 456 789 lub 123 456 789"
                      );
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
