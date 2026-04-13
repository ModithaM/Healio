import axios from "axios";

import {LoginResponse, UserData, userLogin} from "@/types/user/types";
import ToastUtils from "@/utils/toastUtils";
import publicAxios from "@/lib/publicAxios";
import { apiResponse } from "@/types/common";

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

export const registerUser = async (userData: UserData): Promise<apiResponse> => {
  try {
    await publicAxios.post("/auth/register", userData);
    return { success: true };
  } catch (error) {
    const message = getErrorMessage(error, "Registration failed. Please check your details and try again.");
    ToastUtils.error(message);
    return { success: false, error: message };
  }
};

export const loginUser = async (
  user: userLogin
): Promise<apiResponse<LoginResponse> | null> => {
  try {
    const response = await publicAxios.post<LoginResponse>("/auth/login", user);
    ToastUtils.success("Login successful!");
    return { success: true, data: response.data };
  } catch (error) {
    const fallback = "Invalid email/username or password.";
    const message = getErrorMessage(error, fallback);
    const loginMessage =
      message === "Bad credentials" || message === "User not found"
        ? fallback
        : message;

    ToastUtils.error(loginMessage);
    return { success: false, error: loginMessage };
  }
};
