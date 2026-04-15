import axios from "axios";
import { apiResponse } from "@/types/common";
import ToastUtils from "@/utils/toastUtils";
import privateAxios from "@/lib/privateAxios";

export interface PatientProfileData {
  id?: string;
  userId: string;
  bloodGroup?: string;
  gender?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface PatientProfileResponse extends PatientProfileData {
  medicalDocuments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
  }>;
  userInfo?: {
    id: string;
    username: string;
    email: string;
    userDetails?: {
      firstName: string;
      lastName: string;
    };
  };
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data;
  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (typeof data === "object") {
    const validationMessages = Object.values(data)
      .filter((message): message is string => typeof message === "string");

    if (validationMessages.length > 0) {
      return validationMessages.join(". ");
    }
  }

  return fallback;
};

export const createPatientProfile = async (
  profileData: PatientProfileData
): Promise<apiResponse<PatientProfileResponse>> => {
  try {
    const response = await privateAxios.post<PatientProfileResponse>(
      "/patient-service/create",
      profileData
    );
    ToastUtils.success("Patient profile created successfully!");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to create patient profile. Please try again.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getPatientProfileByUserId = async (
  userId: string
): Promise<apiResponse<PatientProfileResponse>> => {
  try {
    const response = await privateAxios.get<PatientProfileResponse>(
      `/patient-service/getPatientByUserId/${userId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch patient profile.");
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { success: false, error: "Patient profile not found" };
    }
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const updatePatientProfile = async (
  userId: string,
  profileData: Partial<PatientProfileData>
): Promise<apiResponse<PatientProfileResponse>> => {
  try {
    const response = await privateAxios.put<PatientProfileResponse>(
      `/patient-service/update/${userId}`,
      profileData
    );
    ToastUtils.success("Patient profile updated successfully!");
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to update patient profile. Please try again.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const deletePatientProfile = async (
  userId: string
): Promise<apiResponse<void>> => {
  try {
    await privateAxios.delete(`/patient-service/deletePatientById/${userId}`);
    ToastUtils.success("Patient profile deleted successfully!");
    return { success: true };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to delete patient profile. Please try again.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getAllPatients = async (): Promise<apiResponse<PatientProfileResponse[]>> => {
  try {
    const response = await privateAxios.get<PatientProfileResponse[]>(
      "/patient-service/getAll"
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch patients.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};