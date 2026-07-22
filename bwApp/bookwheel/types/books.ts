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

export type BookDetailContent = {
  title: string;
  author: string;
  publisher: string;
  description: string;
  cover: string | null;
  itemPage: number;
  toc: string | null;
  isbn: string;
  isInterested: boolean;
};

export type BookDetailResponse = ApiResponse<BookDetailContent>;

export type ReviewVote =
  | "RECOMMEND"
  | "NOT_RECOMMEND";

export type ReviewStatsContent = {
  recommendedRatio: number;
  notRecommendedRatio: number;
  myVote: ReviewVote | null;
};

export type ReviewStatsResponse = ApiResponse<ReviewStatsContent>;

export type BookReviewContent = {
  reviewId: number;
  isbn: string;
  reviewerName: string;
  profileImageUrl: string | null;
  isRecommended: boolean;
  comment: string;
  isHidden: boolean;
  likeCount: number;
  isLikedByMe: boolean;
  createdAt: string;
};

export type BookReviewPage = {
  content: BookReviewContent[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type BookReviewListParams = {
  sort?: "latest" | "popular";
  page?: number;
  size?: number;
};

export type BookReviewListResponse = ApiResponse<BookReviewPage>;

export type CreateBookReviewRequest = {
  isbn: string;
  comment: string;
  isRecommended: boolean;
  isHidden: boolean;
};

export type CreateBookReviewResponse = ApiResponse<BookReviewContent>;

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

export type BookSearchParams = BooksCursorParams & {
  keyword: string;
  categoryId?: number | null;
  publishedFrom?: string | null;
  publishedTo?: string | null;
  minPageCount?: number | null;
  maxPageCount?: number | null;
  excludeInterested?: boolean;
  sort?: BookSearchSort;
};

export type BookSearchContent = {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  coverImageUrl: string | null;
  categoryId: number;
  categoryName: string;
  pageCount: number;
  averageRating: number;
  isInterested: boolean;
};

export type BookSearchPage = CursorPage<BookSearchContent>;
export type BookSearchResponse = ApiResponse<BookSearchPage>;
