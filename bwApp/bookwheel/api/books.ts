import api from "./axios";
import type {
  BookGalleryParams,
  BookGalleryResponse,
  BookSearchParams,
  BookSearchResponse,
  InterestedBooksParams,
  InterestedBooksResponse,
} from "@/types/books";

export const getBookGallery = (params?: BookGalleryParams) => {
  return api.get<BookGalleryResponse>("/books/gallery", { params });
};

export const getInterestedBooks = (params?: InterestedBooksParams) => {
  return api.get<InterestedBooksResponse>("/books/interests", { params });
};

export const searchBooks = (params: BookSearchParams) => {
  return api.get<BookSearchResponse>("/books/search", { params });
};
