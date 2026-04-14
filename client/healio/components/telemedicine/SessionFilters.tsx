"use client";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SessionStatus } from "@/types/telemedicine/types";

export type SessionFilterState = {
  status: "ALL" | SessionStatus;
  doctor: string;
  patient: string;
  query: string;
};

type SessionFiltersProps = {
  filters: SessionFilterState;
  onChange: (filters: SessionFilterState) => void;
  onRefresh: () => void;
  isLoading?: boolean;
};

const inputClass = "h-11 min-w-0 rounded-2xl border border-slate-200 bg-white/70 px-4 text-sm font-semibold outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-200/40 dark:border-white/10 dark:bg-white/10";

export function SessionFilters({ filters, onChange, onRefresh, isLoading = false }: SessionFiltersProps) {
  const setFilter = <T extends keyof SessionFilterState>(key: T, value: SessionFilterState[T]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-white/70 bg-white/68 p-4 shadow-lg shadow-sky-950/8 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.07]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            className={`${inputClass} w-full pl-10`}
            placeholder="Search session title"
            value={filters.query}
            onChange={(event) => setFilter("query", event.target.value)}
          />
        </label>
        <select
          className={inputClass}
          value={filters.status}
          onChange={(event) => setFilter("status", event.target.value as SessionFilterState["status"])}
        >
          <option value="ALL">All statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="WAITING">Waiting</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input
          className={inputClass}
          placeholder="Doctor ID"
          value={filters.doctor}
          onChange={(event) => setFilter("doctor", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Patient ID"
          value={filters.patient}
          onChange={(event) => setFilter("patient", event.target.value)}
        />
        <Button variant="outline" className="h-11 rounded-2xl" onClick={onRefresh} disabled={isLoading}>
          <Filter className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
