import type { ApiResponse, CursorPage, CursorParams } from "@/types/api";

export type BookDetailContent = {
  title: string;
  author: string;
  publisher: string;
  description: string;
  cover: string | null;
  itemPage: number | null;
  isbn: string;
  isInterested: boolean;
  pubDate?: string;
  usageAnalysis: AnalysisData | null;
};

export type AnalysisData = {
  totalLoanCount: number | null;
  mostLoanedAgeGroup: string | null;
  keywords: string[] | null;
}

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

export type InterestedBookContent = {
  bookInfoId: number;
  isbn: string;
  title: string | null;
  author: string | null;
  coverImageUrl: string | null;
  interestedAt: string;
};

export type InterestedBooksPage = CursorPage<InterestedBookContent>;
export type InterestedBooksResponse = ApiResponse<InterestedBooksPage>;
export type InterestedBooksParams = CursorParams;

export type BookLikeContent = {
  isbn: string;
  liked: boolean;
};

export type BookLikeResponse = ApiResponse<BookLikeContent>;

export type ExchangeRecommendationBasis = {
  type: string;
  source: string;
  sourceName: string;
  provider: string;
  sourceUrl: string;
  startDate: string | null;
  endDate: string | null;
  description: string;
};

export type ExchangeRecommendationReview = {
  reviewId: number;
  reviewerName: string;
  comment: string;
  likeCount: number;
  createdAt: string;
};

export type ExchangeRecommendationBook = {
  isbn: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  data4LibraryRank: number;
  data4LibraryLoanCount: number;
  likeCount: number;
  isInterested: boolean;
  review: ExchangeRecommendationReview | null;
};

export type ExchangeRecommendationContent = {
  recommendationDate: string;
  basis: ExchangeRecommendationBasis;
  book: ExchangeRecommendationBook | null;
};

export type ExchangeRecommendationResponse =
  ApiResponse<ExchangeRecommendationContent>;

export type CurrentReadingBookContent = {
  groupId: string;
  title: string;
  coverImageUrl: string;
  upcoming: boolean;
  roundStartDate: string;
  dday: number | null;
};

export type CurrentReadingBooksContent = {
  books: CurrentReadingBookContent[];
};

export type CurrentReadingBooksResponse =
  ApiResponse<CurrentReadingBooksContent>;

export type BookSearchSort = "accuracy" | "latest";

export type BookSearchItem = {
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  thumbnail: string;
  isbn: string;
  isInterested: boolean;
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
