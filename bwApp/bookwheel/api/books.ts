import type {
  BookDetailResponse,
  BookGalleryParams,
  BookGalleryResponse,
  BookSearchParams,
  BookSearchResponse,
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
