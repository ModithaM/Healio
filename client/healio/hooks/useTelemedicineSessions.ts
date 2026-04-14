"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/apiError";
import { getTelemedicineSessions } from "@/service/telemedicine";
import type { SessionStatus, TelemedicineSession } from "@/types/telemedicine/types";
import ToastUtils from "@/utils/toastUtils";

type UseTelemedicineSessionsParams = {
  doctorId?: string;
  patientId?: string;
  status?: SessionStatus;
  enabled?: boolean;
};

export function useTelemedicineSessions({
  doctorId,
  patientId,
  status,
  enabled = true,
}: UseTelemedicineSessionsParams) {
  const [sessions, setSessions] = useState<TelemedicineSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getTelemedicineSessions({ doctorId, patientId, status });
      setSessions(data);
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to load telemedicine sessions.");
      setError(message);
      ToastUtils.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [doctorId, patientId, status]);

  useEffect(() => {
    if (enabled) {
      void refetch();
    }
  }, [enabled, refetch]);

  return { sessions, isLoading, error, refetch };
}
