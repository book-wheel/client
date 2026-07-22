import type {
  BookDetailResponse,
  BookGalleryParams,
  BookGalleryResponse,
  BookReviewListParams,
  BookReviewListResponse,
  BookSearchParams,
  BookSearchResponse,
  CreateBookReviewRequest,
  CreateBookReviewResponse,
  InterestedBooksParams,
  InterestedBooksResponse,
  ReviewStatsResponse,
} from "@/types/books";
import api from "./axios";

export const getBookGallery = (params?: BookGalleryParams) => {
  return api.get<BookGalleryResponse>("/books/gallery", { params });
};

export const getInterestedBooks = (params?: InterestedBooksParams) => {
  return api.get<InterestedBooksResponse>("/books/interests", { params });
};

export const searchBooks = (params: BookSearchParams) => {
  return api.get<BookSearchResponse>("/books/search", { params });
};

export const getBookDetail = (isbn: string) => {
  return api.get<BookDetailResponse>(`/books/${isbn}`);
};

export const getReviewStats = (isbn: string) => {
  return api.get<ReviewStatsResponse>(`/books/${isbn}/reviews/stats`);
};

export const getBookReviews = (
  isbn: string,
  params?: BookReviewListParams,
) => {
  return api.get<BookReviewListResponse>(
    `/books/${isbn}/reviews`,
    { params },
  );
};

export const createBookReview = (
  isbn: string,
  body: CreateBookReviewRequest,
) => {
  return api.post<CreateBookReviewResponse>(
    `/books/${isbn}/reviews`,
    body,
  );
};
