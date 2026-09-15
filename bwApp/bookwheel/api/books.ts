import type {
  BookLikeResponse,
  BookDetailResponse,
  BookReviewListParams,
  BookReviewListResponse,
  BookSearchResponse,
  CreateBookReviewRequest,
  CreateBookReviewResponse,
  ExchangeRecommendationResponse,
  InterestedBooksParams,
  InterestedBooksResponse,
  ReviewLikeResponse,
  ReviewStatsResponse,
  ReviewVoteResponse,
  UpdateReviewVoteRequest,
} from "@/types/books";
import type {
  PostGalleryParams,
  PostGalleryResponse,
} from "@/types/posts";
import api from "./axios";

// 특정 도서의 갤러리
export const getPostGallery = (isbn: string, params?: PostGalleryParams) => {
  return api.get<PostGalleryResponse>(`/books/${isbn}/gallery`, { params });
};

// 전체 교환독서 갤러리
export const getGalleryFeed = (params?: PostGalleryParams) => {
  return api.get<PostGalleryResponse>(`/books/gallery`, {
    params,
  });
};

export const getInterestedBooks = (params?: InterestedBooksParams) => {
  return api.get<InterestedBooksResponse>(`/books/likes`, { params });
};

export const getExchangeRecommendation = () => {
  return api.get<ExchangeRecommendationResponse>(
    `/books/exchange-recommendation`,
  );
};

export const searchBooks = (query: string, page = 1, size = 20) => {
  return api.get<BookSearchResponse>(`/books/search`, {
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

export const getReviewStats = (isbn: string) => {
  return api.get<ReviewStatsResponse>(`/books/${isbn}/reviews/stats`);
};

export const updateReviewVote = (
  isbn: string,
  body: UpdateReviewVoteRequest,
) => {
  return api.put<ReviewVoteResponse>(
    `/books/${encodeURIComponent(isbn)}/reviews/vote`,
    body,
  );
};

export const deleteReviewVote = (isbn: string) => {
  return api.delete<ReviewVoteResponse>(
    `/books/${encodeURIComponent(isbn)}/reviews/vote`,
  );
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

export const toggleBookLike = (isbn: string) => {
  return api.post<BookLikeResponse>(`/books/${isbn}/likes`);
};

export const toggleReviewLike = (reviewId: number) => {
  return api.post<ReviewLikeResponse>(
    `/books/reviews/${reviewId}/likes`,
  );
};
