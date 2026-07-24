import type { ApiResponse } from "@/types/api";

export type CursorPage<T> = {
  content: T[];
  size: number;
  totalElements: number;
  hasNext: boolean;
  nextCursor: string | null;
};

export type BooksCursorParams = {
  cursor?: string | null;
  size?: number;
};

export type BookGalleryContent = {
  galleryId: number;
  bookId: number;
  thumbnailUrl: string;
  imageCount: number;
  createdAt: string;
};

export type BookGalleryPage = CursorPage<BookGalleryContent>;
export type BookGalleryResponse = ApiResponse<BookGalleryPage>;
export type BookGalleryParams = BooksCursorParams;

export type InterestedBookContent = {
  bookId: number;
  title: string;
  author: string;
  coverImageUrl: string | null;
  interestedAt: string;
};

export type InterestedBooksPage = CursorPage<InterestedBookContent>;
export type InterestedBooksResponse = ApiResponse<InterestedBooksPage>;
export type InterestedBooksParams = BooksCursorParams;

export type BookSearchSort = "relevance" | "latest" | "title";

export type BookSearchItem = {
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  thumbnail: string;
  isbn: string;
};

export type BookSearchResponse = ApiResponse<{
  books: BookSearchItem[];
  totalCount: number;
  isEnd: boolean;
}>;

export type BookDetail = {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  pubDate?: string;
  cover: string;
  itemPage: number;
};

export type BookDetailResponse = ApiResponse<BookDetail>;
