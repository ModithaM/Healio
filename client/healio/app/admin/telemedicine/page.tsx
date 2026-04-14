"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, RefreshCw, Video, XCircle } from "lucide-react";

import { ActivityTimeline } from "@/components/telemedicine/ActivityTimeline";
import { SessionCard } from "@/components/telemedicine/SessionCard";
import { SessionFilters, type SessionFilterState } from "@/components/telemedicine/SessionFilters";
import { SessionTable } from "@/components/telemedicine/SessionTable";
import { TelemedicineStatsCard } from "@/components/telemedicine/TelemedicineStatsCard";
import { useSessionStats } from "@/hooks/useSessionStats";
import { useTelemedicineSessions } from "@/hooks/useTelemedicineSessions";
import type { TelemedicineSession } from "@/types/telemedicine/types";

import { AdminPage, Button, GlassCard, SectionHeader } from "../_components/admin-ui";

const initialFilters: SessionFilterState = {
  status: "ALL",
  doctor: "",
  patient: "",
  query: "",
};

const sortByStartTime = (sessions: TelemedicineSession[]) =>
  sessions.slice().sort((first, second) => new Date(first.scheduledStartTime).getTime() - new Date(second.scheduledStartTime).getTime());

const filterSessions = (sessions: TelemedicineSession[], filters: SessionFilterState) => {
  const query = filters.query.trim().toLowerCase();
  const doctor = filters.doctor.trim().toLowerCase();
  const patient = filters.patient.trim().toLowerCase();

  return sessions.filter((session) => {
    const matchesStatus = filters.status === "ALL" || session.status === filters.status;
    const matchesDoctor = !doctor || session.doctorId.toLowerCase().includes(doctor);
    const matchesPatient = !patient || session.patientId.toLowerCase().includes(patient);
    const matchesQuery = !query || session.sessionTitle.toLowerCase().includes(query);
    return matchesStatus && matchesDoctor && matchesPatient && matchesQuery;
  });
};

export default function TelemedicinePage() {
  const [filters, setFilters] = useState<SessionFilterState>(initialFilters);
  const { sessions, isLoading, error, refetch } = useTelemedicineSessions({ enabled: true });
  const stats = useSessionStats(sessions);

  const filteredSessions = useMemo(() => filterSessions(sessions, filters), [sessions, filters]);
  const upcomingSessions = useMemo(
    () => sortByStartTime(filteredSessions.filter((session) => session.status === "SCHEDULED" || session.status === "WAITING")).slice(0, 6),
    [filteredSessions]
  );
  const completedSessions = useMemo(
    () =>
      filteredSessions
        .filter((session) => session.status === "COMPLETED")
        .sort((first, second) => new Date(second.actualEndTime ?? second.updatedAt).getTime() - new Date(first.actualEndTime ?? first.updatedAt).getTime())
        .slice(0, 8),
    [filteredSessions]
  );

  const hasNoSessions = !isLoading && filteredSessions.length === 0;

  return (
    <AdminPage
      eyebrow="Telemedicine"
      title="Telemedicine Monitoring"
      description="Track upcoming rooms, active consultations, completed sessions, and recent virtual care activity through the API Gateway."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 [grid-auto-flow:dense]">
        <TelemedicineStatsCard
          label="Total Sessions"
          value={stats.total}
          helper="All rooms"
          icon={Video}
          accent="from-sky-500 to-cyan-400"
          tone="hover:bg-sky-50/80 dark:hover:bg-sky-400/10"
        />
        <TelemedicineStatsCard
          label="Scheduled Sessions"
          value={stats.scheduled}
          helper="Upcoming"
          icon={CalendarClock}
          accent="from-blue-500 to-sky-400"
          tone="hover:bg-blue-50/80 dark:hover:bg-blue-400/10"
        />
        <TelemedicineStatsCard
          label="Completed Sessions"
          value={stats.completed}
          helper="Finished"
          icon={CheckCircle2}
          accent="from-emerald-500 to-teal-400"
          tone="hover:bg-emerald-50/80 dark:hover:bg-emerald-400/10"
        />
        <TelemedicineStatsCard
          label="Cancelled Sessions"
          value={stats.cancelled}
          helper="Stopped"
          icon={XCircle}
          accent="from-rose-500 to-red-400"
          tone="hover:bg-rose-50/80 dark:hover:bg-rose-400/10"
        />

        <div className="md:col-span-2 xl:col-span-3">
          <SessionFilters filters={filters} onChange={setFilters} onRefresh={refetch} isLoading={isLoading} />
        </div>

        {error && (
          <GlassCard className="md:col-span-2 xl:col-span-4 border-rose-300/60 bg-rose-50/80 text-rose-700 dark:border-rose-300/30 dark:bg-rose-500/10 dark:text-rose-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold">{error}</p>
              <Button variant="outline" className="rounded-2xl" onClick={refetch}>
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </GlassCard>
        )}

        {isLoading && (
          <GlassCard className="md:col-span-2 xl:col-span-4">
            <div className="grid min-h-40 place-items-center text-sm font-bold text-slate-500 dark:text-slate-300">
              Loading telemedicine sessions...
            </div>
          </GlassCard>
        )}

        {hasNoSessions && (
          <GlassCard className="md:col-span-2 xl:col-span-4">
            <div className="grid min-h-56 place-items-center text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  <Video className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-bold">No telemedicine sessions found</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Adjust filters or refresh the session feed.</p>
              </div>
            </div>
          </GlassCard>
        )}

        {!isLoading && !hasNoSessions && (
          <>
            <GlassCard className="md:col-span-2 xl:col-span-2">
              <SectionHeader title="Upcoming Sessions" />
              <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <SessionCard key={session.id} session={session} actionLabel="View" />
                  ))
                ) : (
                  <EmptyState label="No scheduled sessions match these filters." />
                )}
              </div>
            </GlassCard>

            <GlassCard className="md:col-span-2 xl:col-span-4">
              <SectionHeader title="Recently Completed Sessions" />
              <SessionTable sessions={completedSessions} />
            </GlassCard>

            <GlassCard className="md:col-span-2 xl:col-span-2">
              <SectionHeader title="Recent Session Activity" />
              <ActivityTimeline sessions={filteredSessions} />
            </GlassCard>
          </>
        )}
      </div>
    </AdminPage>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/70 p-5 text-sm font-semibold text-slate-500 dark:border-sky-300/30 dark:bg-sky-400/10 dark:text-slate-300">
      {label}
    </div>
  );
}
