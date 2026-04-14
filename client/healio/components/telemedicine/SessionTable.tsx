"use client";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TelemedicineSession } from "@/types/telemedicine/types";
import { formatSessionDateTime, getSessionStatusClass } from "./telemedicine-utils";

type SessionTableProps = {
  sessions: TelemedicineSession[];
};

export function SessionTable({ sessions }: SessionTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/70 p-5 text-sm font-semibold text-slate-500 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-slate-300">
        No completed sessions found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
      <div className="hidden grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_0.9fr_0.6fr] gap-4 border-b border-slate-200/70 bg-slate-950/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 dark:bg-white/[0.04] lg:grid">
        <span>Session</span><span>Doctor</span><span>Patient</span><span>Start</span><span>End</span><span className="text-right">Status</span>
      </div>
      {sessions.map((session) => (
        <div key={session.id} className="grid gap-3 border-b border-slate-200/70 px-4 py-4 last:border-b-0 dark:border-white/10 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_0.9fr_0.6fr] lg:items-center">
          <div>
            <p className="font-bold">{session.sessionTitle}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{session.appointmentId}</p>
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{session.doctorId}</p>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{session.patientId}</p>
          <p className="text-sm font-bold">{formatSessionDateTime(session.actualStartTime ?? session.scheduledStartTime)}</p>
          <p className="text-sm font-bold">{session.actualEndTime ? formatSessionDateTime(session.actualEndTime) : "-"}</p>
          <div className="flex items-center justify-between gap-2 lg:justify-end">
            <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", getSessionStatusClass(session.status))}>{session.status}</span>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
