"use client";

import { Activity, Gauge, Radio, Video } from "lucide-react";

import { telemedicineSessions } from "../_components/admin-data";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

export default function TelemedicinePage() {
  return (
    <AdminPage eyebrow="Telemedicine" title="Telemedicine Monitoring" description="Track live video rooms, upcoming sessions, completed consultations, and operational quality for virtual care.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 [grid-auto-flow:dense]">
        <GlassCard className="relative overflow-hidden md:col-span-2 xl:col-span-2">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/15" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/15" />
          <div className="relative">
            <SectionHeader title="Session Quality Monitor" action={<span className="rounded-full bg-emerald-500/12 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">Stable</span>} />
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Live rooms", value: "42", icon: Radio },
                { label: "Avg latency", value: "118ms", icon: Gauge },
                { label: "Completion", value: "96%", icon: Activity },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200/70 bg-white/64 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                  <metric.icon className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  <p className="mt-4 text-2xl font-bold">{metric.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white dark:bg-white dark:text-slate-950">
              <p className="text-sm font-bold">Video relay cluster is healthy</p>
              <p className="mt-2 text-sm leading-6 text-slate-300 dark:text-slate-600">All active consultations are routed through healthy nodes with no dropped-session alerts in the last 30 minutes.</p>
            </div>
            <Button variant="outline" className="mt-4 rounded-2xl">
              <Video className="h-4 w-4" />
              Review Session Logs
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-2 xl:col-span-2">
          <SectionHeader title="Active Sessions" />
          <div className="grid gap-3">
            {telemedicineSessions.slice(0, 3).map((session) => (
              <SessionRow key={session.title} session={session} />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-1 xl:col-span-2">
          <SectionHeader title="Upcoming Sessions" />
          <div className="grid gap-3">
            {telemedicineSessions.filter((item) => item.status === "Upcoming").map((session) => (
              <SessionRow key={session.title} session={session} />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-1 xl:col-span-2">
          <SectionHeader title="Past Sessions" />
          <div className="grid gap-3">
            {telemedicineSessions.filter((item) => item.status === "Completed").map((session) => (
              <SessionRow key={session.title} session={session} />
            ))}
          </div>
        </GlassCard>
      </div>
    </AdminPage>
  );
}

function SessionRow({ session }: { session: { title: string; patient: string; doctor: string; time: string; status: string } }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/62 p-4 dark:border-white/10 dark:bg-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300"><Video className="h-5 w-5" /></div>
        <div>
          <p className="font-bold">{session.title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{session.patient} · {session.doctor} · {session.time}</p>
        </div>
      </div>
      <StatusBadge status={session.status} />
    </div>
  );
}
