"use client";

import { analyticsKpis, chartData } from "../_components/admin-data";
import { AdminPage, GlassCard, MiniBarChart, SectionHeader, StatCard } from "../_components/admin-ui";

export default function AnalyticsPage() {
  return (
    <AdminPage eyebrow="Analytics" title="Analytics" description="Review appointment volume, telemedicine usage, patient growth, doctor activity, and performance signals across the hospital platform.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 [grid-auto-flow:dense]">
        {analyticsKpis.map((kpi) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} helper={kpi.helper} icon={kpi.icon} accent="from-sky-500 to-emerald-500" />
        ))}

        <GlassCard className="md:col-span-2 xl:col-span-2 xl:row-span-2">
          <SectionHeader title="Appointments per day" action={<Tabs />} />
          <MiniBarChart data={chartData} />
        </GlassCard>

        <GlassCard className="md:col-span-2 xl:col-span-2 xl:row-span-2">
          <SectionHeader title="Telemedicine usage vs active users" action={<Tabs />} />
          <MiniBarChart data={chartData} dual />
        </GlassCard>

        {["Patient growth", "Doctor activity", "Revenue quality", "Care completion"].map((title, index) => (
          <GlassCard key={title} className="xl:col-span-1">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-4 text-3xl font-bold">{["24%", "82%", "$128K", "96%"][index]}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-950/10 dark:bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" style={{ width: `${[72, 82, 64, 96][index]}%` }} />
            </div>
          </GlassCard>
        ))}
      </div>
    </AdminPage>
  );
}

function Tabs() {
  return (
    <div className="flex rounded-full bg-slate-950/5 p-1 dark:bg-white/10">
      {["Weekly", "Monthly", "Yearly"].map((tab, index) => (
        <button key={tab} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${index === 0 ? "bg-white text-sky-700 shadow-sm dark:bg-slate-950 dark:text-sky-300" : "text-slate-500"}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}
