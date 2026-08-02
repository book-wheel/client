export type ApiError = {
  code: string;
  message: string;
} | null;

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError;
};

export type CursorPage<T> = {
  content: T[];
  size: number;
  totalElements: number;
  hasNext: boolean;
  nextCursor: string | null;
};

export type CursorParams = {
  cursor?: string | null;
  size?: number;
};
