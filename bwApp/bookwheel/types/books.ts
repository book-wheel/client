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
  itemPage: number | null;
  toc: string | null;
  isbn: string;
  isInterested: boolean;
  pubDate?: string;
};

export type BookDetail = BookDetailContent;
export type BookDetailResponse = ApiResponse<BookDetail>;

export type ReviewVote =
  | "RECOMMEND"
  | "NOT_RECOMMEND";

export type ReviewStatsContent = {
  recommendedRatio: number;
  notRecommendedRatio: number;
  myVote: ReviewVote | null;
};

export type ReviewStatsResponse = ApiResponse<ReviewStatsContent>;

export type UpdateReviewVoteRequest = {
  vote: ReviewVote;
};

export type ReviewVoteContent = ReviewStatsContent & {
  isbn: string;
};

export type ReviewVoteResponse = ApiResponse<ReviewVoteContent>;

export type BookReviewContent = {
  reviewId: number;
  isbn: string;
  reviewerName: string;
  profileImageUrl: string | null;
  isRecommended: boolean | null;
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
  comment: string;
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

export type BookSearchSort = "accuracy" | "latest";

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

export type ReviewLikeContent = {
  reviewId: number;
  isLikedByMe: boolean;
  likeCount: number;
};

export type ReviewLikeResponse = ApiResponse<ReviewLikeContent>;
