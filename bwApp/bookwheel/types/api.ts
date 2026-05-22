export type ApiError = {
  code: string;
  message: string;
} | null;

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError;
};
