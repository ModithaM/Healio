import axios from "axios";

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  const data = error.response?.data;
  if (!data) {
    return error.message || fallback;
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
