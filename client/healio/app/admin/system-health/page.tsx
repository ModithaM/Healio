"use client";

import { Activity, Clock3 } from "lucide-react";

import { systemLogs, systemServices } from "../_components/admin-data";
import { AdminPage, GlassCard, SectionHeader } from "../_components/admin-ui";

export default function SystemHealthPage() {
  return (
    <AdminPage eyebrow="System Health" title="System Health" description="Track core service status, server metrics, logs, uptime, and active platform sessions.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 [grid-auto-flow:dense]">
        {systemServices.map((service) => (
          <GlassCard key={service.label}>
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <service.icon className="h-6 w-6" />
              </div>
              <span className={service.status === "healthy" ? "rounded-full bg-emerald-500/12 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300" : "rounded-full bg-amber-500/12 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300"}>
                {service.value}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold">{service.label}</h3>
          </GlassCard>
        ))}

        <GlassCard className="md:col-span-2 xl:col-span-2">
          <SectionHeader title="Server metrics" />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Uptime", value: "99.98%", icon: Clock3 },
              { label: "Active sessions", value: "1,482", icon: Activity },
              { label: "Avg latency", value: "118ms", icon: Activity },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl bg-slate-950 p-4 text-white">
                <metric.icon className="h-5 w-5 text-emerald-300" />
                <p className="mt-4 text-2xl font-bold">{metric.value}</p>
                <p className="mt-1 text-sm text-slate-300">{metric.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-2 xl:col-span-2">
          <SectionHeader title="System logs" />
          <div className="grid gap-3">
            {systemLogs.map((log) => (
              <div key={log} className="rounded-2xl border border-slate-200/70 bg-white/62 p-4 font-mono text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                {log}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AdminPage>
  );
}
