export type apiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string;
};
