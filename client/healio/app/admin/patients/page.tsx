"use client";

import { Filter, Pencil, Plus, Trash2, UserRound } from "lucide-react";

import { patients } from "../_components/admin-data";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

export default function PatientsManagementPage() {
  return (
    <AdminPage eyebrow="Patients" title="Patients Management" description="Search, filter, and manage verified hospital patient records with quick operational actions.">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 [grid-auto-flow:dense]">
        <GlassCard className="xl:col-span-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader title="Patient Directory" action={<Button className="rounded-2xl"><Plus className="h-4 w-4" />Add Patient</Button>} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <input className="h-11 rounded-2xl border border-slate-200 bg-white/70 px-4 text-sm font-semibold outline-none transition focus:border-sky-300 dark:border-white/10 dark:bg-white/10" placeholder="Search patient name or ID" />
              <Button variant="outline" className="rounded-2xl"><Filter className="h-4 w-4" />Filter</Button>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
            <div className="hidden grid-cols-[1fr_0.8fr_1.2fr_0.8fr_0.55fr_0.8fr] gap-4 border-b border-slate-200/70 bg-slate-950/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 dark:bg-white/[0.04] lg:grid">
              <span>Name</span><span>ID</span><span>Email</span><span>Phone</span><span>Status</span><span className="text-right">Actions</span>
            </div>
            {patients.map((patient) => (
              <div key={patient.id} className="grid gap-3 border-b border-slate-200/70 px-4 py-4 last:border-b-0 dark:border-white/10 lg:grid-cols-[1fr_0.8fr_1.2fr_0.8fr_0.55fr_0.8fr] lg:items-center">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300"><UserRound className="h-5 w-5" /></div>
                  <p className="font-bold">{patient.name}</p>
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{patient.id}</p>
                <p className="break-all text-sm text-slate-500 dark:text-slate-400">{patient.email}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{patient.phone}</p>
                <StatusBadge status={patient.status} />
                <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                  <Button variant="outline" size="sm" className="rounded-xl">View</Button>
                  <Button variant="outline" size="icon" className="rounded-xl"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-xl text-rose-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {patients.slice(0, 4).map((patient) => (
          <GlassCard key={`${patient.id}-card`}>
            <UserRound className="h-6 w-6 text-sky-500" />
            <h3 className="mt-4 text-lg font-bold">{patient.name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patient.id}</p>
            <div className="mt-4"><StatusBadge status={patient.status} /></div>
          </GlassCard>
        ))}
      </div>
    </AdminPage>
  );
}
