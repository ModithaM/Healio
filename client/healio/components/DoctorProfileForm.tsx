"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createDoctorProfile,
  updateDoctorProfile,
  DoctorProfileCreateData,
  DoctorProfileUpdateData,
} from "@/service/doctorApi";
import {
  doctorProfileCreateSchema,
  doctorProfileUpdateSchema,
} from "@/validation/doctorProfileSchema";

interface DoctorProfileFormProps {
  userId: string;
  mode?: "create" | "edit";
  initialData?: {
    specialization?: string;
    qualifications?: string;
    experienceYears?: number;
    consultationFee?: number;
  };
  onSuccess?: () => void;
  onClose?: () => void;
}

interface FormState {
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: string;
  consultationFee: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function DoctorProfileForm({
  userId,
  mode = "create",
  initialData,
  onSuccess,
  onClose,
}: DoctorProfileFormProps) {
  const [formData, setFormData] = useState<FormState>({
    specialization: initialData?.specialization || "",
    licenseNumber: "",
    qualifications: initialData?.qualifications || "",
    experienceYears:
      initialData?.experienceYears !== undefined
        ? String(initialData.experienceYears)
        : "",
    consultationFee:
      initialData?.consultationFee !== undefined
        ? String(initialData.consultationFee)
        : "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const parsed = {
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        qualifications: formData.qualifications || undefined,
        experienceYears: formData.experienceYears
          ? parseInt(formData.experienceYears, 10)
          : undefined,
        consultationFee: formData.consultationFee
          ? parseFloat(formData.consultationFee)
          : undefined,
      };

      const schema =
        mode === "create" ? doctorProfileCreateSchema : doctorProfileUpdateSchema;
      await schema.validate(parsed, { abortEarly: false });

      let result;
      if (mode === "create") {
        const payload: DoctorProfileCreateData = {
          userId,
          specialization: parsed.specialization!,
          licenseNumber: parsed.licenseNumber!,
          qualifications: parsed.qualifications,
          experienceYears: parsed.experienceYears!,
          consultationFee: parsed.consultationFee!,
        };
        result = await createDoctorProfile(payload);
      } else {
        const payload: DoctorProfileUpdateData = {};
        if (parsed.specialization) payload.specialization = parsed.specialization;
        if (parsed.qualifications) payload.qualifications = parsed.qualifications;
        if (parsed.experienceYears !== undefined)
          payload.experienceYears = parsed.experienceYears;
        if (parsed.consultationFee !== undefined)
          payload.consultationFee = parsed.consultationFee;
        result = await updateDoctorProfile(userId, payload);
      }

      if (result.success) {
        onSuccess?.();
      } else {
        setErrors({ form: result.error || `Failed to ${mode} profile` });
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
        className="w-full max-w-2xl"
      >
        <Card className="rounded-[28px] border-white/70 bg-white/95 p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-black/30 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {mode === "create"
                ? "Complete Your Doctor Profile"
                : "Edit Doctor Profile"}
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="e.g. Cardiology"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={inputClass("specialization")}
                />
                {errors.specialization && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.specialization}
                  </p>
                )}
              </div>

              {mode === "create" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="e.g. SLMC-DR-94218"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={inputClass("licenseNumber")}
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Experience (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  placeholder="e.g. 10"
                  min="0"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className={inputClass("experienceYears")}
                />
                {errors.experienceYears && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.experienceYears}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Consultation Fee (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  placeholder="e.g. 2500.00"
                  min="0.01"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className={inputClass("consultationFee")}
                />
                {errors.consultationFee && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.consultationFee}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Qualifications
                </label>
                <textarea
                  name="qualifications"
                  placeholder="e.g. MBBS (Colombo), MD (Cardiology), FRCP"
                  value={formData.qualifications}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass("qualifications")} resize-none`}
                />
                {errors.qualifications && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.qualifications}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
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
                className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === "create" ? "Creating Profile..." : "Updating Profile..."}
                  </>
                ) : mode === "create" ? (
                  "Create Profile"
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
