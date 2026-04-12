"use client";

import { PhoneCall, Video } from "lucide-react";

import { telemedicineSessions } from "../_components/admin-data";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

export default function TelemedicinePage() {
  const live = telemedicineSessions[0];

  return (
    <AdminPage eyebrow="Telemedicine" title="Telemedicine Monitoring" description="Track live video rooms, upcoming sessions, completed consultations, and operational quality for virtual care.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 [grid-auto-flow:dense]">
        <GlassCard className="relative min-h-[420px] overflow-hidden !border-slate-800 !bg-slate-950 !text-white md:col-span-2 xl:col-span-2 xl:row-span-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.36),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.28),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#082f49_100%)]" />
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-sky-400/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
            <span className="rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-bold text-emerald-950">{live.status}</span>
            <div className="mt-8 grid h-16 w-16 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/15">
              <Video className="h-8 w-8 text-sky-200" />
            </div>
            <h3 className="mt-6 text-3xl font-bold text-white">Live Consultation Now</h3>
            <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-slate-200">{live.patient} with {live.doctor} · {live.time}</p>
            </div>
            <Button className="mt-8 w-fit rounded-2xl !bg-white !text-slate-950 shadow-xl shadow-sky-950/30 hover:!bg-sky-50"><PhoneCall className="h-4 w-4" />Join Monitoring Room</Button>
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
