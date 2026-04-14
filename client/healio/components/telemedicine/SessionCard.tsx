"use client";

import { Activity, CalendarClock, Eye, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TelemedicineSession } from "@/types/telemedicine/types";
import { formatSessionDateTime, getSessionStatusClass } from "./telemedicine-utils";

type SessionCardProps = {
  session: TelemedicineSession;
  variant?: "default" | "active";
  actionLabel?: string;
};

export function SessionCard({ session, variant = "default", actionLabel = "View" }: SessionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white/64 p-4 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.05]",
        variant === "active" && "border-emerald-300/80 bg-emerald-50/80 shadow-lg shadow-emerald-500/10 dark:border-emerald-300/30 dark:bg-emerald-400/10"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-bold">{session.sessionTitle}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Doctor: {session.doctorId}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Patient: {session.patientId}</p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
          {variant === "active" ? <Activity className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", getSessionStatusClass(session.status))}>
          {session.status}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
          <CalendarClock className="h-3.5 w-3.5" />
          {formatSessionDateTime(variant === "active" && session.actualStartTime ? session.actualStartTime : session.scheduledStartTime)}
        </span>
      </div>
      <Button variant="outline" className="mt-4 w-full rounded-2xl">
        <Eye className="h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
}
