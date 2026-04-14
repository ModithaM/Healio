export type SessionStatus = "SCHEDULED" | "WAITING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type PatientNameOption = {
  id: string;
  fullName: string;
};

export type CreateTelemedicineSessionPayload = {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  sessionTitle: string;
  description?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
};

export type UpdateTelemedicineSessionPayload = {
  sessionTitle: string;
  description?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
};

export type TelemedicineSession = {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  sessionTitle: string;
  description?: string | null;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  status: SessionStatus;
  agoraChannelName: string;
  consultationNotes?: string | null;
  prescriptionNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StartSessionResponse = {
  sessionId: string;
  agoraAppId: string;
  agoraChannelName: string;
  agoraToken: string;
  status: SessionStatus;
  actualStartTime: string;
};

export type JoinDetailsResponse = {
  sessionId: string;
  agoraAppId: string;
  agoraChannelName: string;
  agoraToken: string;
  status: SessionStatus;
  doctorId: string;
  patientId: string;
};

export type MeetingJoinDetails = JoinDetailsResponse | StartSessionResponse;
