import axios from "axios";

import privateAxios from "@/lib/privateAxios";
import { apiResponse } from "@/types/common";
import ToastUtils from "@/utils/toastUtils";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export interface PrescriptionItemPayload {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
}

export interface PrescriptionResponse {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  diagnosis: string;
  notes?: string;
  issuedDate: string;
  items: Array<{
    id: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration?: string;
    instructions?: string;
  }>;
}

export interface AppointmentResponse {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  reason?: string;
  cancelReason?: string;
  patient?: {
    userInfo?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
  doctor?: {
    specialization?: string;
    userInfo?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
  prescription?: PrescriptionResponse;
  creationTimestamp?: string;
  updateTimestamp?: string;
}

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
}

export interface UpdateAppointmentPayload {
  appointmentDate?: string;
  appointmentTime?: string;
  reason?: string;
}

export interface UpdateAppointmentStatusPayload {
  status: AppointmentStatus;
  cancelReason?: string;
}

export interface CreatePrescriptionPayload {
  diagnosis: string;
  notes?: string;
  issuedDate?: string;
  items: PrescriptionItemPayload[];
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data;
  if (!data) return fallback;

  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;

  if (typeof data === "object") {
    const messages = Object.values(data).filter((value): value is string => typeof value === "string");
    if (messages.length > 0) {
      return messages.join(". ");
    }
  }

  return fallback;
};

export const createAppointment = async (
  payload: CreateAppointmentPayload,
): Promise<apiResponse<AppointmentResponse>> => {
  try {
    const response = await privateAxios.post<AppointmentResponse>("/appointment-service/appointments", payload);
    ToastUtils.success("Appointment created successfully.");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to create appointment.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getAllAppointments = async (): Promise<apiResponse<AppointmentResponse[]>> => {
  try {
    const response = await privateAxios.get<AppointmentResponse[]>("/appointment-service/appointments");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch appointments.");
    return { success: false, error: message };
  }
};

export const getAppointmentById = async (id: string): Promise<apiResponse<AppointmentResponse>> => {
  try {
    const response = await privateAxios.get<AppointmentResponse>(`/appointment-service/appointments/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch appointment.");
    return { success: false, error: message };
  }
};

export const getAppointmentsByPatientId = async (
  patientId: string,
): Promise<apiResponse<AppointmentResponse[]>> => {
  try {
    const response = await privateAxios.get<AppointmentResponse[]>(
      `/appointment-service/appointments/patient/${patientId}`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch patient appointments.");
    return { success: false, error: message };
  }
};

export const getAppointmentsByDoctorId = async (
  doctorId: string,
): Promise<apiResponse<AppointmentResponse[]>> => {
  try {
    const response = await privateAxios.get<AppointmentResponse[]>(
      `/appointment-service/appointments/doctor/${doctorId}`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch doctor appointments.");
    return { success: false, error: message };
  }
};

export const updateAppointment = async (
  id: string,
  payload: UpdateAppointmentPayload,
): Promise<apiResponse<AppointmentResponse>> => {
  try {
    const response = await privateAxios.put<AppointmentResponse>(`/appointment-service/appointments/${id}`, payload);
    ToastUtils.success("Appointment updated successfully.");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to update appointment.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const updateAppointmentStatus = async (
  id: string,
  payload: UpdateAppointmentStatusPayload,
): Promise<apiResponse<AppointmentResponse>> => {
  try {
    const response = await privateAxios.patch<AppointmentResponse>(
      `/appointment-service/appointments/${id}/status`,
      payload,
    );
    ToastUtils.success("Appointment status updated.");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to update appointment status.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const confirmAppointment = async (id: string): Promise<apiResponse<AppointmentResponse>> => {
  try {
    const response = await privateAxios.patch<AppointmentResponse>(`/appointment-service/appointments/${id}/confirm`);
    ToastUtils.success("Appointment confirmed.");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to confirm appointment.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const completeAppointment = async (id: string): Promise<apiResponse<AppointmentResponse>> => {
  try {
    const response = await privateAxios.patch<AppointmentResponse>(`/appointment-service/appointments/${id}/complete`);
    ToastUtils.success("Appointment marked as completed.");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to complete appointment.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const noShowAppointment = async (id: string): Promise<apiResponse<AppointmentResponse>> => {
  try {
    const response = await privateAxios.patch<AppointmentResponse>(`/appointment-service/appointments/${id}/no-show`);
    ToastUtils.success("Appointment marked as no-show.");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to mark appointment as no-show.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const cancelAppointment = async (
  id: string,
  reason?: string,
): Promise<apiResponse<AppointmentResponse>> => {
  try {
    const response = await privateAxios.post<AppointmentResponse>(`/appointment-service/appointments/${id}/cancel`, null, {
      params: reason ? { reason } : undefined,
    });
    ToastUtils.success("Appointment cancelled.");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to cancel appointment.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const deleteAppointment = async (id: string): Promise<apiResponse<void>> => {
  try {
    await privateAxios.delete(`/appointment-service/appointments/${id}`);
    ToastUtils.success("Appointment deleted.");
    return { success: true };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to delete appointment.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const createPrescription = async (
  appointmentId: string,
  payload: CreatePrescriptionPayload,
): Promise<apiResponse<PrescriptionResponse>> => {
  try {
    const response = await privateAxios.post<PrescriptionResponse>(
      `/appointment-service/appointments/${appointmentId}/prescriptions`,
      payload,
    );
    ToastUtils.success("Prescription created.");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to create prescription.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getPrescriptionByAppointmentId = async (
  appointmentId: string,
): Promise<apiResponse<PrescriptionResponse>> => {
  try {
    const response = await privateAxios.get<PrescriptionResponse>(
      `/appointment-service/appointments/${appointmentId}/prescription`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch prescription.");
    return { success: false, error: message };
  }
};

export const getPrescriptionsByPatientId = async (
  patientId: string,
): Promise<apiResponse<PrescriptionResponse[]>> => {
  try {
    const response = await privateAxios.get<PrescriptionResponse[]>(
      `/appointment-service/prescriptions/patient/${patientId}`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch prescriptions.");
    return { success: false, error: message };
  }
};
