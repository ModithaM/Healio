"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Plus, Stethoscope, UserRound, Video } from "lucide-react";

import {
  activityFeed,
  chartData,
  overviewStats,
  quickActions,
  telemedicineSessions,
} from "../_components/admin-data";
import { AppointmentResponse, getAllAppointments } from "@/service/appointmentApi";
import {
  ActivityTimeline,
  AdminPage,
  Button,
  GlassCard,
  MiniBarChart,
  SectionHeader,
  StatCard,
  StatusBadge,
} from "../_components/admin-ui";

export default function AdminOverviewPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      const result = await getAllAppointments();
      if (result.success) {
        setAppointments(result.data ?? []);
      }
    };

    void loadAppointments();
  }, []);

  const weeklyAppointmentCount = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    return appointments.filter((item) => {
      const date = new Date(item.appointmentDate);
      return !Number.isNaN(date.getTime()) && date >= sevenDaysAgo && date <= today;
    }).length;
  }, [appointments]);

  return (
    <AdminPage
      eyebrow="Overview"
      title="Hospital operations at a glance"
      description="Monitor patients, doctors, appointments, telemedicine rooms, and high-priority operational events from one balanced command center."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 [grid-auto-flow:dense]">
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}

        <GlassCard className="md:col-span-2 xl:col-span-2 xl:row-span-2">
          <SectionHeader title="Appointment Trends" action={<span className="rounded-full bg-sky-500/12 px-3 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300">Last 7 days</span>} />
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-bold">{weeklyAppointmentCount}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">appointments scheduled this week</p>
            </div>
            <CalendarClock className="h-10 w-10 text-sky-500" />
          </div>
          <MiniBarChart data={chartData} />
        </GlassCard>

        <GlassCard className="md:col-span-1 xl:col-span-1">
          <SectionHeader title="Recent Appointments" />
          <div className="grid gap-3">
            {appointments.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.05]">
                <p className="font-bold">{item.patient?.userInfo?.firstName || "Patient"} {item.patient?.userInfo?.lastName || ""}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.doctor?.userInfo?.firstName || "Doctor"} {item.doctor?.userInfo?.lastName || ""} · {item.appointmentTime}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{item.reason?.toLowerCase().includes("telemedicine") ? "Online" : "Offline"}</span>
                  <StatusBadge status={item.status === "PENDING" ? "Scheduled" : item.status} />
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300/70 bg-white/50 p-3 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                No appointments available.
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-1 xl:col-span-1">
          <SectionHeader title="Telemedicine Sessions" />
          <div className="grid gap-3">
            {telemedicineSessions.slice(0, 3).map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">{item.patient}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-2 xl:col-span-2">
          <SectionHeader title="Quick Actions" />
          <div className="grid gap-3 sm:grid-cols-3">
            {quickActions.map((item) => (
              <Link key={item.label} href={item.href} className="rounded-2xl border border-slate-200/70 bg-white/64 p-4 text-left transition hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-sky-400/10">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-bold">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.helper}</p>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-2 xl:col-span-2">
          <SectionHeader title="Recent Activity" action={<Button variant="outline" className="rounded-2xl"><Plus className="h-4 w-4" />Audit Log</Button>} />
          <ActivityTimeline items={activityFeed} />
        </GlassCard>

        <GlassCard className="md:col-span-2 xl:col-span-2">
          <SectionHeader title="Operational quick stats" />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Patient wait time", value: "11m", icon: UserRound },
              { label: "Doctor coverage", value: "82%", icon: Stethoscope },
              { label: "Video uptime", value: "99.9%", icon: Video },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-950 p-4 text-white">
                <item.icon className="h-5 w-5 text-emerald-300" />
                <p className="mt-4 text-2xl font-bold">{item.value}</p>
                <p className="mt-1 text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AdminPage>
  );
}
