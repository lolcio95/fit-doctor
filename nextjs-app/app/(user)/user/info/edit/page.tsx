"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileForm from "./components/ProfileForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { schema, FormValues } from "./components/ProfileForm/consts";

export default function Page() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/user/info");
      const json = await res.json();
      setProfile(json);
      reset({
        sex: json.sex ?? "",
        birthDate: json.birthDate?.slice(0, 10) ?? "",
        weight: json.weights?.[json.weights.length - 1]?.weight ?? "",
        height: json.height ?? "",
        goal: json.goal ?? "",
        activityLevel: json.activityLevel ?? "",
      });
      setLoading(false);
    })();
  }, [reset]);

  const initialNormalized = useMemo(() => JSON.stringify(profile), [profile]);
  const watched = watch();
  const changed = useMemo(
    () => JSON.stringify(watched) !== initialNormalized,
    [watched, initialNormalized]
  );

  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch("/api/user/info", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      reset(json);
      router.push("/user/info");
    } else {
      alert("Wystąpił błąd podczas zapisu");
    }
  });

  if (loading) return <p>Ładowanie...</p>;

  return (
    <main className="py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-color-secondary mb-6">
          Edycja danych
        </h1>
        <p className="text-color-tertiary mb-8 max-w-2xl">
          Edytuj swoje aktualne dane.
        </p>
        <ProfileForm
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
          changed={changed}
          onCancel={() => router.back()}
        />
        <div className="flex justify-end mt-6 gap-3">
          <Button onClick={onSubmit} disabled={isSubmitting || !changed}>
            {isSubmitting ? "Zapisuję..." : "Zapisz"}
          </Button>
          <Button onClick={() => router.back()} variant="link">
            Anuluj
          </Button>
        </div>
      </div>
    </main>
  );
}
