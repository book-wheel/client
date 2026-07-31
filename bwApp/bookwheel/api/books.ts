import type {
  BookDetailResponse,
  BookGalleryParams,
  BookGalleryResponse,
  BookReviewListParams,
  BookReviewListResponse,
  BookSearchResponse,
  CreateBookReviewRequest,
  CreateBookReviewResponse,
  InterestedBooksParams,
  InterestedBooksResponse,
  ReviewLikeResponse,
  ReviewStatsResponse,
  ReviewVoteResponse,
  UpdateReviewVoteRequest,
} from "@/types/books";
import api from "./axios";

export const getBookGallery = (isbn: string, params?: BookGalleryParams) => {
  return api.get<BookGalleryResponse>(`/books/${isbn}/gallery`, { params });
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
  return api.post(`/books/${isbn}/likes`);
};

export const toggleReviewLike = (reviewId: number) => {
  return api.post<ReviewLikeResponse>(
    `/books/reviews/${reviewId}/likes`,
  );
};
