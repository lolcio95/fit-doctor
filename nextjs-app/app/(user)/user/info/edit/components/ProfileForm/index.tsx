"use client";

import React from "react";
import { Controller } from "react-hook-form";
import {
  GOAL_OPTIONS,
  ACTIVITY_OPTIONS,
  ActivityValue,
} from "@/app/consts/userInfo";
import clsx from "clsx";
import { DateInput } from "@/app/components/atoms/DateInput";

type ProfileFormProps = {
  control: any;
  errors: Record<string, any>;
  isSubmitting: boolean;
  changed: boolean;
  onCancel: () => void;
  className?: string;
};

export default function ProfileForm({
  control,
  errors,
  onCancel,
  className,
}: ProfileFormProps) {
  return (
    <form
      className={clsx(
        { "w-full bg-background-card p-6 rounded-lg shadow": !className },
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sex */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Płeć</label>
          <div className="flex items-center space-x-4">
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="MALE"
                      checked={field.value === "MALE"}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <span className="text-sm">Mężczyzna</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="FEMALE"
                      checked={field.value === "FEMALE"}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <span className="text-sm">Kobieta</span>
                  </label>
                </>
              )}
            />
          </div>
          {errors.sex && (
            <p className="text-sm text-red-600 mt-2">{errors.sex.message}</p>
          )}
        </div>

        {/* Birthdate */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Data urodzenia</label>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DateInput
                max={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 border rounded-md text-sm border-gray-200 focus:outline-none focus:ring-0"
                {...field}
              />
            )}
          />
          {errors.birthDate && (
            <p className="text-sm text-red-600 mt-2">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        {/* Weight */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Aktualna waga (kg)</label>
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                step="0.1"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.valueAsNumber)} // 👈 kluczowa linia
                className="px-3 py-2 border rounded-md text-sm border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
          />
          {errors.weight && (
            <p className="text-sm text-red-600 mt-2">{errors.weight.message}</p>
          )}
        </div>

        {/* Height */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Wzrost (cm)</label>
          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.valueAsNumber)} // 👈 też tutaj
                className="px-3 py-2 border rounded-md text-sm border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
          />
          {errors.height && (
            <p className="text-sm text-red-600 mt-2">{errors.height.message}</p>
          )}
        </div>

        {/* Goal */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Cel sylwetkowy</label>
          <Controller
            name="goal"
            control={control}
            render={({ field }) => (
              <select
                className="px-3 py-2 border rounded-md text-sm border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                {...field}
                value={field.value ?? ""}
              >
                <option value="">-- Wybierz cel --</option>
                {GOAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.goal && (
            <p className="text-sm text-red-600 mt-2">{errors.goal.message}</p>
          )}
        </div>

        {/* Activity */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">
            Aktywność w ciągu dnia
          </label>
          <Controller
            name="activityLevel"
            control={control}
            render={({ field }) => (
              <select
                className="px-3 py-2 border rounded-md text-sm border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                {...field}
                value={field.value ?? ""}
              >
                <option value="">-- Wybierz aktywność --</option>
                {(Object.keys(ACTIVITY_OPTIONS) as ActivityValue[]).map((v) => (
                  <option key={v} value={v}>
                    {ACTIVITY_OPTIONS[v]}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.activityLevel && (
            <p className="text-sm text-red-600 mt-2">
              {errors.activityLevel.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
