"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileForm from "@/app/(user)/user/info/edit/components/ProfileForm";
import {
  PhoneInputForm,
  normalizePhoneForSending,
} from "@/app/(user)/user/profile/components/PhoneInputForm";
import { formatDisplayPhone } from "@/app/(user)/user/profile/components/PhoneInputForm/utils";
import {
  FormValues as PhoneFormValues,
  schema as phoneSchema,
} from "@/app/(user)/user/profile/components/PhoneInputForm/consts";
import {
  schema as infoSchema,
  FormValues as InfoFormValues,
} from "@/app/(user)/user/info/edit/components/ProfileForm/consts";
import { zodResolver } from "@hookform/resolvers/zod";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  onOneTime: () => void | Promise<void>;
  onSubscription: () => void | Promise<void>;
};

export default function PaymentModal({
  isOpen,
  onClose,
  loading,
  error,
  onOneTime,
  onSubscription,
}: PaymentModalProps) {
  const [isUserDataLoading, setIsUserDataLoading] = useState(false);
  const [isUserSettingsLoading, setIsUserSettingLoading] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [savingInfo, setSavingInfo] = useState(false);

  // Formularze react-hook-form
  const {
    control: infoControl,
    handleSubmit: handleInfoSubmit,
    formState: {
      errors: infoErrors,
      isSubmitting: isInfoSubmitting,
      isDirty: isInfoDirty,
      isValid: isInfoValid,
    },
    reset: resetInfo,
  } = useForm<InfoFormValues>({
    resolver: zodResolver(infoSchema),
  });

  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    formState: {
      errors: phoneErrors,
      isSubmitting: isPhoneSubmitting,
      isDirty: isPhoneDirty,
      isValid: isPhoneValid,
    },
    setValue: setPhoneValue,
  } = useForm<PhoneFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(phoneSchema),
  });

  // Pobieranie danych użytkownika
  useEffect(() => {
    if (!isOpen) return;
    setIsUserDataLoading(true);
    setIsUserSettingLoading(true);
    fetch("/api/user/info")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          resetInfo({
            sex: data.sex ?? "",
            birthDate: data.birthDate?.slice(0, 10) ?? "",
            weight: data.weights?.[data.weights.length - 1]?.weight ?? "",
            height: data.height ?? "",
            goal: data.goal ?? "",
            activityLevel: data.activityLevel ?? "",
          });
        }
      })
      .finally(() => setIsUserDataLoading(false));

    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.phone) {
          setPhoneValue("phone", formatDisplayPhone(data.phone) ?? "", {
            shouldValidate: true,
          });
        }
      })
      .finally(() => setIsUserSettingLoading(false));
  }, [isOpen, resetInfo, setPhoneValue]);

  const onSubmitPhone = handlePhoneSubmit(async (data: { phone: string }) => {
    setSavingPhone(true);
    setPhoneError(null);
    try {
      const normalized = normalizePhoneForSending(data.phone);
      if (!normalized) throw new Error("Niepoprawny numer telefonu");
      const res = await fetch("/api/user/change-phone-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Błąd podczas zapisu numeru");
      // setUserPhone((prev: any) => (json?.phone));
      console.log("user 1 phone json: ", json);
    } catch (err: any) {
      setPhoneError(err.message);
    } finally {
      setSavingPhone(false);
    }
  });

  const onSubmitInfo = handleInfoSubmit(async (data) => {
    setSavingInfo(true);
    try {
      const res = await fetch("/api/user/info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Błąd podczas zapisu danych użytkownika");
    } catch (err) {
      alert("Wystąpił błąd podczas zapisu danych użytkownika");
    } finally {
      setSavingInfo(false);
    }
  });

  const handleOneTimePayment = async () => {
    await onSubmitInfo();
    await onSubmitPhone();
    if (isInfoValid && isPhoneValid) {
      onOneTime();
    }
  };

  const handleSubscriptionPayment = async () => {
    await onSubmitInfo();
    await onSubmitPhone();
    if (isInfoValid && isPhoneValid) {
      onSubscription();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-background-card rounded-lg shadow-lg py-7 h-full overflow-y-scroll lg:overflow-y-auto lg:h-auto px-3 lg:px-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold">Uzupełnij dane przed płatnością</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {isUserDataLoading || isUserSettingsLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-8">
            <ProfileForm
              control={infoControl}
              errors={infoErrors}
              isSubmitting={savingInfo}
              changed={true}
              onCancel={() => onClose()}
              className="p-0"
            />

            <PhoneInputForm
              control={phoneControl}
              errors={phoneErrors}
              disabled={savingPhone}
            />
            {phoneError && (
              <p className="text-red-600 text-sm mt-2">{phoneError}</p>
            )}

            <div className="space-y-4">
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                  {error}
                </div>
              )}
              <p className="text-sm font-bold text-color-tertiary">
                Możesz zapłacić jednorazowo lub wykupić subskrypcję.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleOneTimePayment}
                  disabled={loading || isInfoSubmitting || isPhoneSubmitting}
                >
                  Płatność jednorazowa
                </Button>
                <Button
                  onClick={handleSubscriptionPayment}
                  disabled={loading || isInfoSubmitting || isPhoneSubmitting}
                  variant="outline"
                >
                  Płatność cykliczna (subskrypcja)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
