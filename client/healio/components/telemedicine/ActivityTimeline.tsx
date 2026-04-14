"use client";

import { CalendarClock, CheckCircle2, PlayCircle, Video, XCircle } from "lucide-react";

import type { TelemedicineSession } from "@/types/telemedicine/types";
import { formatSessionDateTime } from "./telemedicine-utils";

type ActivityTimelineProps = {
  sessions: TelemedicineSession[];
};

const getActivity = (session: TelemedicineSession) => {
  if (session.status === "ONGOING") return { title: "Session started", icon: PlayCircle, time: session.actualStartTime ?? session.updatedAt };
  if (session.status === "COMPLETED") return { title: "Session completed", icon: CheckCircle2, time: session.actualEndTime ?? session.updatedAt };
  if (session.status === "CANCELLED") return { title: "Session cancelled", icon: XCircle, time: session.updatedAt };
  if (session.status === "SCHEDULED" || session.status === "WAITING") return { title: "Session created", icon: CalendarClock, time: session.createdAt };
  return { title: "Session updated", icon: Video, time: session.updatedAt };
};

export function ActivityTimeline({ sessions }: ActivityTimelineProps) {
  const items = sessions
    .slice()
    .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime())
    .slice(0, 6)
    .map((session) => ({ session, ...getActivity(session) }));

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/70 p-5 text-sm font-semibold text-slate-500 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-slate-300">
        No recent telemedicine activity.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={`${item.session.id}-${item.title}`} className="relative flex gap-4 pb-5 last:pb-0">
          {index !== items.length - 1 && <div className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-sky-300 to-emerald-300 dark:from-sky-400/40 dark:to-emerald-400/40" />}
          <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
            <item.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 rounded-2xl border border-slate-200/70 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold">{item.title}</h3>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-300">{formatSessionDateTime(item.time)}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {item.session.sessionTitle} · Doctor {item.session.doctorId} · Patient {item.session.patientId}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
