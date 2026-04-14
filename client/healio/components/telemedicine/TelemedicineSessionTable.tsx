"use client";

import { Loader2, Pencil, Trash2, Video, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PatientNameOption, TelemedicineSession } from "@/types/telemedicine/types";
import { canJoinSession, formatSessionDateTime, getSessionStatusClass } from "./telemedicine-utils";

type TelemedicineSessionTableProps = {
  sessions: TelemedicineSession[];
  isLoading?: boolean;
  viewer: "doctor" | "patient";
  patients?: PatientNameOption[];
  onJoin: (session: TelemedicineSession) => void;
  onEdit?: (session: TelemedicineSession) => void;
  onDelete?: (session: TelemedicineSession) => void;
  onCancel?: (session: TelemedicineSession) => void;
};

export function TelemedicineSessionTable({
  sessions,
  isLoading = false,
  viewer,
  patients = [],
  onJoin,
  onEdit,
  onDelete,
  onCancel,
}: TelemedicineSessionTableProps) {
  const patientNameById = new Map(patients.map((patient) => [patient.id, patient.fullName]));
  const partyLabel = viewer === "doctor" ? "Patient" : "Doctor";

  if (isLoading) {
    return (
      <div className="mt-5 flex min-h-36 items-center justify-center rounded-[24px] border border-slate-200/70 bg-white/60 text-sm font-bold text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading telemedicine sessions...
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="mt-5 rounded-[24px] border border-dashed border-sky-300 bg-sky-50/70 p-5 text-sm font-semibold text-slate-500 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-slate-300">
        No telemedicine sessions found.
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 hidden overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-white/[0.05] lg:block">
        <div className="grid grid-cols-[1.15fr_0.85fr_1fr_0.65fr_1fr] gap-4 border-b border-slate-200/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10">
          <span>Session</span>
          <span>{partyLabel}</span>
          <span>Schedule</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid grid-cols-[1.15fr_0.85fr_1fr_0.65fr_1fr] items-center gap-4 border-b border-slate-200/70 px-5 py-4 last:border-b-0 dark:border-white/10"
          >
            <div>
              <p className="font-bold">{session.sessionTitle}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {session.appointmentId} · Telemedicine
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {viewer === "doctor"
                ? patientNameById.get(session.patientId) ?? session.patientId
                : session.doctorId}
            </p>
            <p className="text-sm font-bold">{formatSessionDateTime(session.scheduledStartTime)}</p>
            <span className={cn("w-fit rounded-full px-3 py-1.5 text-xs font-bold", getSessionStatusClass(session.status))}>
              {session.status}
            </span>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                className="rounded-2xl bg-emerald-500 hover:bg-emerald-400"
                disabled={!canJoinSession(session)}
                onClick={() => onJoin(session)}
              >
                <Video className="h-4 w-4" />
                Join
              </Button>
              {viewer === "doctor" && onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl"
                  disabled={session.status === "COMPLETED"}
                  onClick={() => onEdit(session)}
                  aria-label={`Edit ${session.sessionTitle}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {viewer === "doctor" && onCancel && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-500/10"
                  disabled={session.status === "COMPLETED" || session.status === "CANCELLED"}
                  onClick={() => onCancel(session)}
                  aria-label={`Cancel ${session.sessionTitle}`}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
              {viewer === "doctor" && onDelete && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  disabled={session.status === "ONGOING"}
                  onClick={() => onDelete(session)}
                  aria-label={`Delete ${session.sessionTitle}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3.5 lg:hidden">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-[26px] border border-slate-200/70 bg-white/64 p-4 dark:border-white/10 dark:bg-white/[0.05]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{session.sessionTitle}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {formatSessionDateTime(session.scheduledStartTime)}
                </p>
              </div>
              <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", getSessionStatusClass(session.status))}>
                {session.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {partyLabel}: {viewer === "doctor" ? patientNameById.get(session.patientId) ?? session.patientId : session.doctorId}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="rounded-2xl bg-emerald-500 hover:bg-emerald-400"
                disabled={!canJoinSession(session)}
                onClick={() => onJoin(session)}
              >
                <Video className="h-4 w-4" />
                Join
              </Button>
              {viewer === "doctor" && onEdit && (
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  disabled={session.status === "COMPLETED"}
                  onClick={() => onEdit(session)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
              {viewer === "doctor" && onCancel && (
                <Button
                  variant="outline"
                  className="rounded-2xl text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-500/10"
                  disabled={session.status === "COMPLETED" || session.status === "CANCELLED"}
                  onClick={() => onCancel(session)}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
              )}
              {viewer === "doctor" && onDelete && (
                <Button
                  variant="outline"
                  className="rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  disabled={session.status === "ONGOING"}
                  onClick={() => onDelete(session)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
