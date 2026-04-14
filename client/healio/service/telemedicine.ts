import privateAxios from "@/lib/privateAxios";
import type {
  CreateTelemedicineSessionPayload,
  JoinDetailsResponse,
  SessionStatus,
  StartSessionResponse,
  TelemedicineSession,
  UpdateTelemedicineSessionPayload,
} from "@/types/telemedicine/types";

const TELEMEDICINE_SESSIONS_PATH = "/telemedicine-service/sessions";

type GetSessionsParams = {
  doctorId?: string;
  patientId?: string;
  status?: SessionStatus;
};

export const createTelemedicineSession = async (
  payload: CreateTelemedicineSessionPayload
): Promise<TelemedicineSession> => {
  const response = await privateAxios.post<TelemedicineSession>(TELEMEDICINE_SESSIONS_PATH, payload);
  return response.data;
};

export const updateTelemedicineSession = async (
  sessionId: string,
  payload: UpdateTelemedicineSessionPayload
): Promise<TelemedicineSession> => {
  const response = await privateAxios.put<TelemedicineSession>(`${TELEMEDICINE_SESSIONS_PATH}/${sessionId}`, payload);
  return response.data;
};

export const deleteTelemedicineSession = async (sessionId: string): Promise<void> => {
  await privateAxios.delete(`${TELEMEDICINE_SESSIONS_PATH}/${sessionId}`);
};

export const cancelTelemedicineSession = async (sessionId: string): Promise<TelemedicineSession> => {
  const response = await privateAxios.patch<TelemedicineSession>(`${TELEMEDICINE_SESSIONS_PATH}/${sessionId}/cancel`);
  return response.data;
};

export const getTelemedicineSessions = async ({
  doctorId,
  patientId,
  status,
}: GetSessionsParams): Promise<TelemedicineSession[]> => {
  const response = await privateAxios.get<TelemedicineSession[]>(TELEMEDICINE_SESSIONS_PATH, {
    params: {
      doctorId,
      patientId,
      status,
    },
  });
  return response.data;
};

export const startTelemedicineSession = async (sessionId: string): Promise<StartSessionResponse> => {
  const response = await privateAxios.patch<StartSessionResponse>(`${TELEMEDICINE_SESSIONS_PATH}/${sessionId}/start`);
  return response.data;
};

export const getTelemedicineJoinDetails = async (sessionId: string): Promise<JoinDetailsResponse> => {
  const response = await privateAxios.get<JoinDetailsResponse>(`${TELEMEDICINE_SESSIONS_PATH}/${sessionId}/join-details`);
  return response.data;
};

export const completeTelemedicineSession = async (sessionId: string): Promise<TelemedicineSession> => {
  const response = await privateAxios.patch<TelemedicineSession>(`${TELEMEDICINE_SESSIONS_PATH}/${sessionId}/complete`);
  return response.data;
};
