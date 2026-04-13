import privateAxios from "@/lib/privateAxios";
import type { PatientNameOption } from "@/types/telemedicine/types";

export const getPatientNames = async (): Promise<PatientNameOption[]> => {
  const response = await privateAxios.get<PatientNameOption[]>("/patient-service/names");
  return response.data;
};
