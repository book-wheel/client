import type { BookItem } from "@/components/books/types";
import type { InterestedBooksResponse } from "@/types/books";

const bookImage = require("@/assets/images/book.png");

export const mockInterestedBooksResponse: InterestedBooksResponse = {
  success: true,
  data: {
    content: Array.from({ length: 12 }, (_, index) => {
      const bookId = index + 1;

      return {
        bookId,
        title: `관심 도서 ${bookId}`,
        author: "책바퀴",
        coverImageUrl: `https://cdn.example.com/books/${bookId}.jpg`,
        interestedAt: "2026-05-09T12:30:00Z",
      };
    }),
    size: 30,
    totalElements: 12,
    hasNext: false,
    nextCursor: null,
  },
  error: null,
};

export const mockInterestBooks: BookItem[] =
  mockInterestedBooksResponse.data.content.map((book) => ({
    id: String(book.bookId),
    title: book.title,
    author: book.author,
    image: bookImage,
  }));
