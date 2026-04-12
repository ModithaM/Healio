"use client";

import { CalendarClock, Filter } from "lucide-react";

import { appointments } from "../_components/admin-data";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

export default function AppointmentsPage() {
  return (
    <AdminPage eyebrow="Appointments" title="Appointments" description="Monitor scheduled, completed, and cancelled appointments across clinic and online consultation channels.">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 [grid-auto-flow:dense]">
        <GlassCard className="xl:col-span-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader title="Appointment Table" action={<Button className="rounded-2xl"><CalendarClock className="h-4 w-4" />Schedule Appointment</Button>} />
            <div className="flex flex-wrap gap-2">
              {["Date", "Status", "Doctor"].map((filter) => (
                <Button key={filter} variant="outline" className="rounded-2xl"><Filter className="h-4 w-4" />{filter}</Button>
              ))}
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
            <div className="hidden grid-cols-[1fr_1fr_0.8fr_0.55fr_0.55fr_0.7fr] gap-4 border-b border-slate-200/70 bg-slate-950/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 dark:bg-white/[0.04] lg:grid">
              <span>Patient</span><span>Doctor</span><span>Date / Time</span><span>Status</span><span>Type</span><span className="text-right">Actions</span>
            </div>
            {appointments.map((item) => (
              <div key={`${item.patient}-${item.time}`} className="grid gap-3 border-b border-slate-200/70 px-4 py-4 last:border-b-0 dark:border-white/10 lg:grid-cols-[1fr_1fr_0.8fr_0.55fr_0.55fr_0.7fr] lg:items-center">
                <p className="font-bold">{item.patient}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.doctor}</p>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.date} · {item.time}</p>
                <StatusBadge status={item.status} />
                <span className="w-fit rounded-full bg-slate-950/5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{item.type}</span>
                <div className="flex justify-start lg:justify-end"><Button variant="outline" className="rounded-2xl">Details</Button></div>
              </div>
            ))}
          </div>
        </GlassCard>

        {["Scheduled", "Completed", "Cancelled", "Online"].map((item, index) => (
          <GlassCard key={item}>
            <CalendarClock className="h-6 w-6 text-sky-500" />
            <p className="mt-5 text-3xl font-bold">{[18, 44, 3, 21][index]}</p>
            <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">{item} today</p>
          </GlassCard>
        ))}
      </div>
    </AdminPage>
  );
}
