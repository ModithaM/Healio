"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/apiError";
import { getPatientNames } from "@/service/patient";
import type { PatientNameOption } from "@/types/telemedicine/types";
import ToastUtils from "@/utils/toastUtils";

export function usePatients(enabled = true) {
  const [patients, setPatients] = useState<PatientNameOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPatientNames();
      setPatients(data);
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to load patients.");
      setError(message);
      ToastUtils.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      void refetch();
    }
  }, [enabled, refetch]);

  return { patients, isLoading, error, refetch };
}
