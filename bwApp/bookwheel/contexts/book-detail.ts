import { createContext, useContext } from "react";

import type { BookDetailContent } from "@/types/books";
// 각 파일에서 API를 따로 호출하면 같은 요청이 두 번 나가므로, 부모 레이아웃에서 한 번 조회한 값을 Context로 공유한다.
type BookDetailContextValue = {
  book: BookDetailContent | null;
  isLoading: boolean;
  error: unknown;
  isbn?: string;
};

export const BookDetailContext =
  createContext<BookDetailContextValue | null>(null);

// 하위 탭 화면에서 책 상세 데이터를 꺼내 쓸 때 사용
export const useBookDetail = () => {
  const context = useContext(BookDetailContext);

  if (!context) {
    throw new Error("책 상세 화면 안에서만 사용할 수 있습니다.");
  }

  return context;
};
