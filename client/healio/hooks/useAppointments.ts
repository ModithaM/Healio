import { useEffect, useState, useCallback } from "react";
import {
  getAppointmentsByPatientIdPaginated,
  getAppointmentsByDoctorIdPaginated,
  AppointmentResponse,
  PaginatedResponse,
} from "@/service/appointmentApi";

interface UseAppointmentsOptions {
  patientId?: string;
  doctorId?: string;
  enabled?: boolean;
  pageSize?: number;
}

interface UseAppointmentsResult {
  appointments: AppointmentResponse[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refetch: () => void;
}

export const useAppointments = ({
  patientId,
  doctorId,
  enabled = true,
  pageSize = 10,
}: UseAppointmentsOptions): UseAppointmentsResult => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchAppointments = useCallback(
    async (page: number) => {
      if (!enabled || (!patientId && !doctorId)) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let response: { success: boolean; data?: PaginatedResponse<AppointmentResponse>; error?: string };

        if (patientId) {
          response = await getAppointmentsByPatientIdPaginated(patientId, page, pageSize);
        } else if (doctorId) {
          response = await getAppointmentsByDoctorIdPaginated(doctorId, page, pageSize);
        } else {
          return;
        }

        if (response.success && response.data) {
          setAppointments(response.data.content);
          setCurrentPage(response.data.pageNumber);
          setTotalPages(response.data.totalPages);
          setTotalElements(response.data.totalElements);
        } else {
          setError(response.error || "Failed to fetch appointments");
          setAppointments([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching appointments");
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    },
    [patientId, doctorId, enabled, pageSize],
  );

  useEffect(() => {
    void fetchAppointments(0);
  }, [fetchAppointments]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        void fetchAppointments(page);
      }
    },
    [totalPages, fetchAppointments],
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      void fetchAppointments(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchAppointments]);

  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      void fetchAppointments(currentPage - 1);
    }
  }, [currentPage, fetchAppointments]);

  const refetch = useCallback(() => {
    void fetchAppointments(currentPage);
  }, [currentPage, fetchAppointments]);

  return {
    appointments,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalElements,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  };
};
