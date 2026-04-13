import privateAxios from "@/lib/privateAxios";
import type { PatientNameOption } from "@/types/telemedicine/types";

export const getPatientNames = async (): Promise<PatientNameOption[]> => {
  const response = await privateAxios.get<PatientNameOption[]>("/api/patients/names");
  return response.data;
};
