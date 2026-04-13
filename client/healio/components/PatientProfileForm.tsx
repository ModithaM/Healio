"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createPatientProfile, updatePatientProfile, PatientProfileData } from "@/service/patientApi";
import { patientProfileValidationSchema } from "@/validation/patientProfileSchema";

interface PatientProfileFormProps {
  userId: string;
  mode?: "create" | "edit";
  initialData?: PatientProfileData;
  onSuccess?: () => void;
  onClose?: () => void;
}

const bloodGroups = [
  "O_POSITIVE",
  "O_NEGATIVE",
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
];

const genders = ["MALE", "FEMALE", "OTHER"];

interface FormErrors {
  [key: string]: string;
}

export default function PatientProfileForm({ 
  userId, 
  mode = "create",
  initialData,
  onSuccess, 
  onClose 
}: PatientProfileFormProps) {
  const [formData, setFormData] = useState<PatientProfileData>(
    initialData || {
      userId,
      bloodGroup: "",
      gender: "",
      dateOfBirth: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
    
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
      await patientProfileValidationSchema.validate(formData, { abortEarly: false });

      const result = mode === "create" 
        ? await createPatientProfile(formData)
        : await updatePatientProfile(userId, formData);

      if (result.success) {
        onSuccess?.();
      } else {
        setErrors({ form: result.error || `Failed to ${mode} profile` });
      }
    } catch (error: any) {
      const newErrors: FormErrors = {};
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
      } else if (error.message) {
        newErrors.form = error.message;
      }
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

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
        <Card className="rounded-[28px] border-white/70 bg-white/95 p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-black/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {mode === "create" ? "Complete Your Profile" : "Edit Your Profile"}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium bg-white dark:bg-white/5 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-400/20 ${
                    errors.gender
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-white/10"
                  }`}
                >
                  <option value="">Select Gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender.charAt(0) + gender.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup || ""}
                  onChange={handleChange}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium bg-white dark:bg-white/5 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-400/20 ${
                    errors.bloodGroup
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-white/10"
                  }`}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="mt-1 text-xs text-red-500">{errors.bloodGroup}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium bg-white dark:bg-white/5 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-400/20 ${
                    errors.dateOfBirth
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-white/10"
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Emergency Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  placeholder="+94 77 248 9031"
                  value={formData.emergencyContactPhone || ""}
                  onChange={handleChange}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium placeholder:text-slate-400 bg-white dark:bg-white/5 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:placeholder:text-slate-500 dark:focus:ring-sky-400/20 ${
                    errors.emergencyContactPhone
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-white/10"
                  }`}
                />
                {errors.emergencyContactPhone && (
                  <p className="mt-1 text-xs text-red-500">{errors.emergencyContactPhone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Emergency Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  placeholder="John Doe"
                  value={formData.emergencyContactName || ""}
                  onChange={handleChange}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium placeholder:text-slate-400 bg-white dark:bg-white/5 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:placeholder:text-slate-500 dark:focus:ring-sky-400/20 ${
                    errors.emergencyContactName
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-white/10"
                  }`}
                />
                {errors.emergencyContactName && (
                  <p className="mt-1 text-xs text-red-500">{errors.emergencyContactName}</p>
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
