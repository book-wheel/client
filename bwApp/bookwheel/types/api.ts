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
  totalElements: number | null;
  hasNext: boolean;
  nextCursor: string | null;
};

export type CursorParams = {
  cursor?: string | null;
  size?: number;
};

export type PageParams = {
  page?: number;
  size?: number;
};

export type NumberPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};
