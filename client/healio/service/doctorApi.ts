import axios from "axios";
import { apiResponse } from "@/types/common";
import ToastUtils from "@/utils/toastUtils";
import privateAxios from "@/lib/privateAxios";

//types
export interface DoctorProfileCreateData {
  userId: string;
  specialization: string;
  licenseNumber: string;
  qualifications?: string;
  experienceYears: number;
  consultationFee: number;
}

export interface DoctorProfileUpdateData {
  specialization?: string;
  qualifications?: string;
  experienceYears?: number;
  consultationFee?: number;
}

export interface DoctorAvailabilityData {
  dayOfWeek: string;
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
  isActive?: boolean;
}

export interface DoctorAvailabilityResponse {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface DoctorProfileResponse {
  id: string;
  userId: string;
  specialization: string;
  licenseNumber: string;
  qualifications?: string;
  experienceYears: number;
  consultationFee: number;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  availabilitySlots?: DoctorAvailabilityResponse[];
  userInfo?: {
    id: string;
    username: string;
    email: string;
  };
}

// error helper
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data;
  if (!data) return fallback;

  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;

  if (typeof data === "object") {
    const msgs = Object.values(data).filter(
      (v): v is string => typeof v === "string"
    );
    if (msgs.length > 0) return msgs.join(". ");
  }

  return fallback;
};

//Doctor profile APIs
export const createDoctorProfile = async (
  data: DoctorProfileCreateData
): Promise<apiResponse<DoctorProfileResponse>> => {
  try {
    const response = await privateAxios.post<DoctorProfileResponse>(
      "/doctor-service/create",
      data
    );
    ToastUtils.success("Doctor profile created successfully!");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to create doctor profile. Please try again."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getDoctorProfileByUserId = async (
  userId: string
): Promise<apiResponse<DoctorProfileResponse>> => {
  try {
    const response = await privateAxios.get<DoctorProfileResponse>(
      `/doctor-service/getDoctorByUserId/${userId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { success: false, error: "Doctor profile not found" };
    }
    const message = getErrorMessage(error, "Failed to fetch doctor profile.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getDoctorProfileById = async (
  id: string
): Promise<apiResponse<DoctorProfileResponse>> => {
  try {
    const response = await privateAxios.get<DoctorProfileResponse>(
      `/doctor-service/getDoctorById/${id}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch doctor profile.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const updateDoctorProfile = async (
  userId: string,
  data: DoctorProfileUpdateData
): Promise<apiResponse<DoctorProfileResponse>> => {
  try {
    const response = await privateAxios.put<DoctorProfileResponse>(
      `/doctor-service/update/${userId}`,
      data
    );
    ToastUtils.success("Doctor profile updated successfully!");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to update doctor profile. Please try again."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const deleteDoctorProfile = async (
  userId: string
): Promise<apiResponse<void>> => {
  try {
    await privateAxios.delete(`/doctor-service/deleteDoctorById/${userId}`);
    ToastUtils.success("Doctor profile deleted successfully!");
    return { success: true };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to delete doctor profile."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getAllDoctors = async (): Promise<
  apiResponse<DoctorProfileResponse[]>
> => {
  try {
    const response = await privateAxios.get<DoctorProfileResponse[]>(
      "/doctor-service/getAll"
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch doctors.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getDoctorsBySpecialization = async (
  specialization: string
): Promise<apiResponse<DoctorProfileResponse[]>> => {
  try {
    const response = await privateAxios.get<DoctorProfileResponse[]>(
      `/doctor-service/getBySpecialization/${specialization}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to fetch doctors by specialization."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

// Admin Verification APIs
export const getDoctorsByStatus = async (
  status: "PENDING" | "VERIFIED" | "REJECTED"
): Promise<apiResponse<DoctorProfileResponse[]>> => {
  try {
    const response = await privateAxios.get<DoctorProfileResponse[]>(
      `/doctor-service/getByStatus/${status}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to fetch doctors by status."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const updateDoctorVerificationStatus = async (
  doctorId: string,
  status: "PENDING" | "VERIFIED" | "REJECTED"
): Promise<apiResponse<DoctorProfileResponse>> => {
  try {
    const response = await privateAxios.put<DoctorProfileResponse>(
      `/doctor-service/verify/${doctorId}?status=${status}`
    );
    const label =
      status === "VERIFIED"
        ? "verified"
        : status === "REJECTED"
        ? "rejected"
        : "updated";
    ToastUtils.success(`Doctor ${label} successfully!`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to update verification status."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

//Availability APIs
export const addDoctorAvailability = async (
  userId: string,
  data: DoctorAvailabilityData
): Promise<apiResponse<DoctorAvailabilityResponse>> => {
  try {
    const response = await privateAxios.post<DoctorAvailabilityResponse>(
      `/doctor-service/availability/add/${userId}`,
      data
    );
    ToastUtils.success("Availability slot added successfully!");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to add availability slot."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getDoctorAvailability = async (
  userId: string
): Promise<apiResponse<DoctorAvailabilityResponse[]>> => {
  try {
    const response = await privateAxios.get<DoctorAvailabilityResponse[]>(
      `/doctor-service/availability/get/${userId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch availability.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const updateDoctorAvailability = async (
  userId: string,
  availabilityId: string,
  data: DoctorAvailabilityData
): Promise<apiResponse<DoctorAvailabilityResponse>> => {
  try {
    const response = await privateAxios.put<DoctorAvailabilityResponse>(
      `/doctor-service/availability/update/${userId}/${availabilityId}`,
      data
    );
    ToastUtils.success("Availability slot updated successfully!");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to update availability slot."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const deleteDoctorAvailability = async (
  userId: string,
  availabilityId: string
): Promise<apiResponse<void>> => {
  try {
    await privateAxios.delete(
      `/doctor-service/availability/delete/${userId}/${availabilityId}`
    );
    ToastUtils.success("Availability slot deleted successfully!");
    return { success: true };
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Failed to delete availability slot."
    );
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};
