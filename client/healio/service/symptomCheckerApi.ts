import axios from "axios";
import privateAxios from "@/lib/privateAxios";
import { apiResponse } from "@/types/common";
import ToastUtils from "@/utils/toastUtils";
import type {
  SymptomAnalysisRequest,
  SymptomAnalysisResponse,
  SymptomCheckHistoryItem,
} from "@/types/symptom-checker/types";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  return fallback;
};

export const analyzeSymptoms = async (
  request: SymptomAnalysisRequest
): Promise<apiResponse<SymptomAnalysisResponse>> => {
  try {
    const response = await privateAxios.post<SymptomAnalysisResponse>(
      "/symptom-checker/analyze",
      request
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to analyze symptoms. Please try again.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const getSymptomCheckHistory = async (
  userId: string
): Promise<apiResponse<SymptomCheckHistoryItem[]>> => {
  try {
    const response = await privateAxios.get<SymptomCheckHistoryItem[]>(
      `/symptom-checker/history/${userId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch symptom check history.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};
