import api from "./axios";
import type {
  BookDetailResponse,
  BookGalleryParams,
  BookGalleryResponse,
  InterestedBooksParams,
  InterestedBooksResponse,
  BookSearchResponse,
} from "@/types/books";

export const getBookGallery = (params?: BookGalleryParams) => {
  return api.get<BookGalleryResponse>("/books/gallery", { params });
};

export const getInterestedBooks = (params?: InterestedBooksParams) => {
  return api.get<InterestedBooksResponse>("/books/interests", { params });
};

export const searchBooks = (query: string, page = 1, size = 20) => {
  return api.get<BookSearchResponse>("/books/search", {
    params: {
      query,
      sort: "accuracy",
      page,
      size,
    },
  });
};

export const getBookDetail = (isbn: string) => {
  return api.get<BookDetailResponse>(`/books/${isbn}`);
};
