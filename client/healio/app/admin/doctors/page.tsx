"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Plus, Star, Stethoscope } from "lucide-react";

import { doctors } from "../_components/admin-data";
import { AdminPage, Button, GlassCard, SectionHeader, StatusBadge } from "../_components/admin-ui";

export default function DoctorsManagementPage() {
  return (
    <AdminPage eyebrow="Doctors" title="Doctors Management" description="Manage clinician profiles, specialties, availability, verification status, and hospital department coverage.">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 [grid-auto-flow:dense]">
        <GlassCard className="md:col-span-2 xl:col-span-4">
          <SectionHeader title="Doctor List" action={<Button className="rounded-2xl"><Plus className="h-4 w-4" />Add Doctor</Button>} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="rounded-2xl border border-slate-200/70 bg-white/64 p-4 transition hover:-translate-y-1 hover:border-sky-300 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Image src={doctor.avatar} alt={`${doctor.name} avatar`} width={52} height={52} className="rounded-2xl bg-sky-50" />
                    <div>
                      <h3 className="font-bold">{doctor.name}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{doctor.specialty}</p>
                    </div>
                  </div>
                  <StatusBadge status={doctor.status} />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <Info label="Rating" value={doctor.rating} icon={<Star className="h-4 w-4 text-amber-400" />} />
                  <Info label="Exp." value={doctor.experience} />
                  <Info label="Mode" value={doctor.availability.includes("Video") ? "Video" : "Clinic"} />
                </div>
                <p className="mt-4 rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">{doctor.availability}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-2xl">Edit</Button>
                  <Button className="flex-1 rounded-2xl"><Stethoscope className="h-4 w-4" />View</Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AdminPage>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-950/[0.04] p-3 text-center dark:bg-white/10">
      <p className="flex items-center justify-center gap-1 text-sm font-bold">{icon}{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-400">{label}</p>
    </div>
  );
}
