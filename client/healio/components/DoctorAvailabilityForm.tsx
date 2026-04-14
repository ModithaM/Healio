"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  addDoctorAvailability,
  updateDoctorAvailability,
  DoctorAvailabilityData,
  DoctorAvailabilityResponse,
} from "@/service/doctorApi";
import { doctorAvailabilitySchema } from "@/validation/doctorProfileSchema";

interface DoctorAvailabilityFormProps {
  userId: string;
  mode?: "add" | "edit";
  initialData?: DoctorAvailabilityResponse;
  onSuccess?: () => void;
  onClose?: () => void;
}

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

interface FormErrors {
  [key: string]: string;
}

// Strip seconds from "HH:mm:ss" → "HH:mm" for <input type="time">
const toTimeInput = (t?: string): string => {
  if (!t) return "";
  return t.length >= 5 ? t.slice(0, 5) : t;
};

// Append seconds for backend: "HH:mm" → "HH:mm:ss"
const toTimePayload = (t: string): string => {
  if (!t) return t;
  return t.length === 5 ? `${t}:00` : t;
};

export default function DoctorAvailabilityForm({
  userId,
  mode = "add",
  initialData,
  onSuccess,
  onClose,
}: DoctorAvailabilityFormProps) {
  const [formData, setFormData] = useState({
    dayOfWeek: initialData?.dayOfWeek || "",
    startTime: toTimeInput(initialData?.startTime),
    endTime: toTimeInput(initialData?.endTime),
    isActive: initialData?.isActive ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await doctorAvailabilitySchema.validate(formData, { abortEarly: false });

      const payload: DoctorAvailabilityData = {
        dayOfWeek: formData.dayOfWeek,
        startTime: toTimePayload(formData.startTime),
        endTime: toTimePayload(formData.endTime),
        isActive: formData.isActive,
      };

      let result;
      if (mode === "add") {
        result = await addDoctorAvailability(userId, payload);
      } else {
        result = await updateDoctorAvailability(
          userId,
          initialData!.id,
          payload
        );
      }

      if (result.success) {
        onSuccess?.();
      } else {
        setErrors({
          form: result.error || `Failed to ${mode} availability slot`,
        });
      }
    } catch (error: any) {
      const newErrors: FormErrors = {};
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach((err: any) => {
          if (err.path) newErrors[err.path] = err.message;
        });
      } else if (error.message) {
        newErrors.form = error.message;
      }
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm font-medium bg-white dark:bg-white/5 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-400/20 outline-none transition ${
      errors[field]
        ? "border-red-400 dark:border-red-500"
        : "border-slate-200 dark:border-white/10"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg"
      >
        <Card className="rounded-[28px] border-white/70 bg-white/95 p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-black/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {mode === "add" ? "Add Availability Slot" : "Edit Availability Slot"}
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                {errors.form}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Day of Week <span className="text-red-500">*</span>
              </label>
              <select
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                className={inputClass("dayOfWeek")}
              >
                <option value="">Select Day</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {errors.dayOfWeek && (
                <p className="mt-1 text-xs text-red-500">{errors.dayOfWeek}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={inputClass("startTime")}
                />
                {errors.startTime && (
                  <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={inputClass("endTime")}
                />
                {errors.endTime && (
                  <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-sky-500 accent-sky-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">
                Active slot (visible to patients)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              {onClose && (
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-linear-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === "add" ? "Adding Slot..." : "Updating Slot..."}
                  </>
                ) : mode === "add" ? (
                  "Add Slot"
                ) : (
                  "Update Slot"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
