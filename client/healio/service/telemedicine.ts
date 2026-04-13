import privateAxios from "@/lib/privateAxios";
import type {
  CreateTelemedicineSessionPayload,
  JoinDetailsResponse,
  SessionStatus,
  StartSessionResponse,
  TelemedicineSession,
} from "@/types/telemedicine/types";

type GetSessionsParams = {
  doctorId?: string;
  patientId?: string;
  status?: SessionStatus;
};

export const createTelemedicineSession = async (
  payload: CreateTelemedicineSessionPayload
): Promise<TelemedicineSession> => {
  const response = await privateAxios.post<TelemedicineSession>("/telemedicine-service/sessions", payload);
  return response.data;
};

export const getTelemedicineSessions = async ({
  doctorId,
  patientId,
  status,
}: GetSessionsParams): Promise<TelemedicineSession[]> => {
  const response = await privateAxios.get<TelemedicineSession[]>("/telemedicine-service/sessions", {
    params: {
      doctorId,
      patientId,
      status,
    },
  });
  return response.data;
};

export const startTelemedicineSession = async (sessionId: string): Promise<StartSessionResponse> => {
  const response = await privateAxios.patch<StartSessionResponse>(`/telemedicine-service/sessions/${sessionId}/start`);
  return response.data;
};

export const getTelemedicineJoinDetails = async (sessionId: string): Promise<JoinDetailsResponse> => {
  const response = await privateAxios.get<JoinDetailsResponse>(`/telemedicine-service/sessions/${sessionId}/join-details`);
  return response.data;
};

export const completeTelemedicineSession = async (sessionId: string): Promise<TelemedicineSession> => {
  const response = await privateAxios.patch<TelemedicineSession>(`/telemedicine-service/sessions/${sessionId}/complete`);
  return response.data;
};
