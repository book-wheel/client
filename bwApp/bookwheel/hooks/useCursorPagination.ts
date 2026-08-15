import { useCallback, useRef, useState } from "react";

import type {
  CursorPage,
  CursorParams,
} from "@/types/api";

// 커서 API를 호출하는 함수의 모양 정의
export type FetchCursorPage<T> = (
  params: CursorParams,
) => Promise<CursorPage<T> | null>;

// 훅이 받는 설정값의 타입
export type UseCursorPaginationOptions<T> = {
  fetchPage: FetchCursorPage<T>;
  pageSize?: number;
};

// 공통 훅이 화면에 돌려줄 값의 형태 정의
export type UseCursorPaginationResult<T> = {
  items: T[]; // 현재까지 불러온 데이터 목록
  totalElements: number; // 서버에 저장된 전체 게시물 개수
  hasNext: boolean;
  isLoading: boolean;
  error: unknown;
  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
};

const DEFAULT_PAGE_SIZE = 20;

export function useCursorPagination<T>({
  fetchPage,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseCursorPaginationOptions<T>): UseCursorPaginationResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // state는 갱신이 비동기이므로 ref로 연속 호출 차단
  const isLoadingRef = useRef(false);
  // reset 이후 늦게 도착한 이전 요청의 응답을 무시
  const requestIdRef = useRef(0);

  const requestPage = useCallback(
    async (cursor: string | null, replaceItems: boolean) => {
      // replaceItems: true면 첫 페이지로 교체하고, false면 다음 페이지를 뒤에 붙임
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);

      const requestId = ++requestIdRef.current;

      try {
        const params: CursorParams = { size: pageSize };

        // 첫 페이지에는 cursor를 생략하고, 다음 페이지부터 서버가 준 cursor 전송
        if (cursor !== null) {
          params.cursor = cursor;
        }

        const page = await fetchPage(params);

        // 요청 중 reset되어 번호가 달라졌다면 이 응답은 오래된 응답으로 간주해 return
        if (requestId !== requestIdRef.current) return;

        // ApiResponse의 data가 null이면 더 가져올 페이지가 없는 상태
        if (!page) {
          if (replaceItems) {
            setItems([]);
            setTotalElements(0);
          }

          setNextCursor(null);
          setHasNext(false);
          return;
        }

        setItems((currentItems) =>
          replaceItems
            ? page.content
            : [...currentItems, ...page.content],
        );
        setNextCursor(page.nextCursor);
        setTotalElements(page.totalElements);
        setHasNext(page.hasNext);
      } catch (caughtError) {
        if (requestId === requestIdRef.current) {
          setError(caughtError);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    },
    [fetchPage, pageSize],
  );

  const loadInitial = useCallback(async () => {
    // cursor 없이 요청하고 기존 목록을 첫 페이지 결과로 교체
    await requestPage(null, true);
  }, [requestPage]);

  const loadMore = useCallback(async () => {
    // 마지막 페이지이거나 다음 cursor가 없으면 요청 X
    if (!hasNext || nextCursor === null) return;

    await requestPage(nextCursor, false);
  }, [hasNext, nextCursor, requestPage]);

  const reset = useCallback(() => {
    // 진행 중인 요청의 번호를 무효화하여 늦게 온 응답이 상태를 바꾸지 못하게 함
    requestIdRef.current += 1;
    isLoadingRef.current = false;

    setItems([]);
    setNextCursor(null);
    setTotalElements(0);
    setHasNext(false);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    items,
    totalElements,
    hasNext,
    isLoading,
    error,
    loadInitial,
    loadMore,
    refresh: loadInitial,
    reset,
  };
}
