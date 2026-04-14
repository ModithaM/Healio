"use client";

import { useMemo } from "react";

import type { SessionStatus, TelemedicineSession } from "@/types/telemedicine/types";

const statuses: SessionStatus[] = ["SCHEDULED", "WAITING", "ONGOING", "COMPLETED", "CANCELLED"];

export function useSessionStats(sessions: TelemedicineSession[]) {
  return useMemo(() => {
    const counts = statuses.reduce<Record<SessionStatus, number>>((result, status) => {
      result[status] = 0;
      return result;
    }, {} as Record<SessionStatus, number>);

    sessions.forEach((session) => {
      counts[session.status] += 1;
    });

    return {
      total: sessions.length,
      scheduled: counts.SCHEDULED + counts.WAITING,
      ongoing: counts.ONGOING,
      completed: counts.COMPLETED,
      cancelled: counts.CANCELLED,
      counts,
    };
  }, [sessions]);
}
