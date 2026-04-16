import { useCallback, useEffect, useState } from "react";
import { getPrescriptionsByPatientIdPaginated, PrescriptionResponse, PaginatedResponse } from "@/service/appointmentApi";

interface UsePrescriptionsOptions {
  patientId?: string;
  enabled?: boolean;
  pageSize?: number;
}

interface UsePrescriptionsResult {
  prescriptions: PrescriptionResponse[];
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

export const usePrescriptions = ({
  patientId,
  enabled = true,
  pageSize = 10,
}: UsePrescriptionsOptions): UsePrescriptionsResult => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchPrescriptions = useCallback(
    async (page: number) => {
      if (!enabled || !patientId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getPrescriptionsByPatientIdPaginated(patientId, page, pageSize);

        if (response.success && response.data) {
          setPrescriptions(response.data.content);
          setCurrentPage(response.data.pageNumber);
          setTotalPages(response.data.totalPages);
          setTotalElements(response.data.totalElements);
        } else {
          setError(response.error || "Failed to fetch prescriptions");
          setPrescriptions([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching prescriptions");
        setPrescriptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [patientId, enabled, pageSize],
  );

  useEffect(() => {
    void fetchPrescriptions(0);
  }, [fetchPrescriptions]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        void fetchPrescriptions(page);
      }
    },
    [totalPages, fetchPrescriptions],
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      void fetchPrescriptions(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchPrescriptions]);

  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      void fetchPrescriptions(currentPage - 1);
    }
  }, [currentPage, fetchPrescriptions]);

  const refetch = useCallback(() => {
    void fetchPrescriptions(currentPage);
  }, [currentPage, fetchPrescriptions]);

  return {
    prescriptions,
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
