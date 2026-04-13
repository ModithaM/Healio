"use client";

import { motion } from "framer-motion";
import { CalendarClock, Loader2, Video, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePatients } from "@/hooks/usePatients";
import { getApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import { createTelemedicineSession } from "@/service/telemedicine";
import type { TelemedicineSession } from "@/types/telemedicine/types";
import ToastUtils from "@/utils/toastUtils";
import { toLocalInputDateTime } from "./telemedicine-utils";

type CreateSessionDialogProps = {
  doctorId: string;
  onClose: () => void;
  onCreated: (session: TelemedicineSession) => void;
};

type FormState = {
  appointmentId: string;
  patientId: string;
  sessionTitle: string;
  description: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
};

export function CreateSessionDialog({ doctorId, onClose, onCreated }: CreateSessionDialogProps) {
  const now = useMemo(() => new Date(), []);
  const defaultStart = useMemo(() => toLocalInputDateTime(new Date(now.getTime() + 30 * 60_000)), [now]);
  const defaultEnd = useMemo(() => toLocalInputDateTime(new Date(now.getTime() + 60 * 60_000)), [now]);
  const { patients, isLoading: patientsLoading } = usePatients(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [form, setForm] = useState<FormState>({
    appointmentId: `TM-${Date.now()}`,
    patientId: "",
    sessionTitle: "",
    description: "",
    scheduledStartTime: defaultStart,
    scheduledEndTime: defaultEnd,
  });

  const labelClass = "grid min-w-0 gap-1.5";
  const fieldClass = "h-11 w-full min-w-0 rounded-2xl border border-white/70 bg-white/80 px-3 text-sm font-semibold outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/[0.06]";
  const textareaClass = "min-h-24 w-full min-w-0 rounded-2xl border border-white/70 bg-white/80 px-3 py-3 text-sm font-semibold outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/[0.06]";

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.appointmentId.trim()) nextErrors.appointmentId = "Appointment id is required.";
    if (!form.patientId) nextErrors.patientId = "Select a patient.";
    if (!form.sessionTitle.trim()) nextErrors.sessionTitle = "Session title is required.";
    if (!form.scheduledStartTime) nextErrors.scheduledStartTime = "Start time is required.";
    if (!form.scheduledEndTime) nextErrors.scheduledEndTime = "End time is required.";
    if (
      form.scheduledStartTime &&
      form.scheduledEndTime &&
      new Date(form.scheduledStartTime) >= new Date(form.scheduledEndTime)
    ) {
      nextErrors.scheduledEndTime = "End time must be after start time.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const session = await createTelemedicineSession({
        appointmentId: form.appointmentId.trim(),
        patientId: form.patientId,
        doctorId,
        sessionTitle: form.sessionTitle.trim(),
        description: form.description.trim(),
        scheduledStartTime: form.scheduledStartTime,
        scheduledEndTime: form.scheduledEndTime,
      });
      ToastUtils.success("Telemedicine session created.");
      onCreated(session);
      onClose();
    } catch (error) {
      ToastUtils.error(getApiErrorMessage(error, "Unable to create telemedicine session."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.24 }}
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-[24px] border border-sky-200/80 bg-sky-50/95 p-4 shadow-2xl shadow-sky-950/20 backdrop-blur-xl dark:border-sky-300/20 dark:bg-slate-950/95 sm:p-5 xl:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
              Generate session
            </p>
            <h3 className="mt-2 text-xl font-bold">Create video consultation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Select a patient, set the schedule, and prepare the video room.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white/70 text-slate-500 transition hover:border-rose-300 hover:text-rose-500 dark:border-white/10 dark:bg-white/[0.06]"
            aria-label="Close session form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Patient</span>
            <select
              className={fieldClass}
              value={form.patientId}
              onChange={(event) => setField("patientId", event.target.value)}
              disabled={patientsLoading}
            >
              <option value="">{patientsLoading ? "Loading patients..." : "Select patient"}</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
            {patients.length === 0 && !patientsLoading && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">No patients available.</span>
            )}
            {errors.patientId && <span className="text-xs font-semibold text-rose-500">{errors.patientId}</span>}
          </label>

          <label className={labelClass}>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Appointment ID</span>
            <input
              className={fieldClass}
              value={form.appointmentId}
              onChange={(event) => setField("appointmentId", event.target.value)}
            />
            {errors.appointmentId && <span className="text-xs font-semibold text-rose-500">{errors.appointmentId}</span>}
          </label>

          <label className={cn(labelClass, "sm:col-span-2")}>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Session title</span>
            <input
              className={fieldClass}
              placeholder="Follow-up video consultation"
              value={form.sessionTitle}
              onChange={(event) => setField("sessionTitle", event.target.value)}
            />
            {errors.sessionTitle && <span className="text-xs font-semibold text-rose-500">{errors.sessionTitle}</span>}
          </label>

          <label className={labelClass}>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Start time</span>
            <input
              type="datetime-local"
              className={fieldClass}
              value={form.scheduledStartTime}
              onChange={(event) => setField("scheduledStartTime", event.target.value)}
            />
            {errors.scheduledStartTime && (
              <span className="text-xs font-semibold text-rose-500">{errors.scheduledStartTime}</span>
            )}
          </label>

          <label className={labelClass}>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">End time</span>
            <input
              type="datetime-local"
              className={fieldClass}
              value={form.scheduledEndTime}
              onChange={(event) => setField("scheduledEndTime", event.target.value)}
            />
            {errors.scheduledEndTime && (
              <span className="text-xs font-semibold text-rose-500">{errors.scheduledEndTime}</span>
            )}
          </label>

          <label className={cn(labelClass, "sm:col-span-2")}>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Description</span>
            <textarea
              className={textareaClass}
              placeholder="Notes for this consultation"
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            disabled={isSubmitting || patientsLoading}
            className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
            {isSubmitting ? "Creating..." : "Create Session"}
          </Button>
          <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={onClose}>
            <CalendarClock className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}
