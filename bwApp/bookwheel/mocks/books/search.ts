import type { BookSearchResponse } from "@/types/books";

export const mockBookSearchResponse: BookSearchResponse = {
  success: true,
  data: {
    content: [
      {
        bookId: 1,
        title: "불편한 편의점",
        author: "김호연",
        publisher: "나무옆의자",
        publishedDate: "2021-04-20",
        coverImageUrl: "https://cdn.example.com/books/1.jpg",
        categoryId: 1,
        categoryName: "소설",
        pageCount: 268,
        averageRating: 4.6,
        isInterested: false,
      },
      {
        bookId: 2,
        title: "불편한 편의점2",
        author: "김호연",
        publisher: "나무옆의자",
        publishedDate: "2022-08-10",
        coverImageUrl: "https://cdn.example.com/books/2.jpg",
        categoryId: 1,
        categoryName: "소설",
        pageCount: 320,
        averageRating: 4.8,
        isInterested: true,
      },
    ],
    size: 20,
    totalElements: 24,
    hasNext: true,
    nextCursor: "eyJib29rSWQiOjJ9",
  },
  error: null,
};
