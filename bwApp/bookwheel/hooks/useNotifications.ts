import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/notifications";
import { useNotificationContext } from "@/contexts/notifications";
import type { NotificationItem } from "@/types/notifications";
import { useFocusEffect } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";

const NOTIFICATION_PAGE_SIZE = 20;

type LoadingMode = "initial" | "refresh" | "more" | null;

// Hook: 알림 화면에 필요한 목록 상태와 사용자 동작을 묶어서 제공한다.
export const useNotifications = () => {
  const isFocused = useIsFocused();
  const {
    refreshKey,
    decrementUnreadCount,
    clearUnreadCount,
    refreshUnreadCount,
  } = useNotificationContext();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [nextPage, setNextPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loadingMode, setLoadingMode] = useState<LoadingMode>(null);
  const [error, setError] = useState<unknown>(null);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // 빠르게 연속 호출되거나 늦은 응답이 도착해도 목록이 꼬이지 않게 막는다.
  const isLoadingRef = useRef(false);
  const requestIdRef = useRef(0);
  const handledRefreshKeyRef = useRef(refreshKey);

  // 첫 조회·새로고침·다음 페이지 조회가 같은 요청 함수를 사용한다.
  const requestPage = useCallback(
    async (pageNumber: number, mode: Exclude<LoadingMode, null>) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoadingMode(mode);
      setError(null);
      const requestId = ++requestIdRef.current;

      try {
        const response = await getNotifications({
          page: pageNumber,
          size: NOTIFICATION_PAGE_SIZE,
        });
        const result = response.data;

        if (!result.success || !result.data) {
          throw new Error(
            result.error?.message ?? "알림을 불러오지 못했습니다.",
          );
        }

        if (requestId !== requestIdRef.current) return;

        const page = result.data;

        setNotifications((currentNotifications) => {
          if (pageNumber === 0) return page.content;

          // 페이지가 밀려 같은 알림이 다시 와도 ID 기준으로 한 번만 보관한다.
          const mergedNotifications = new Map(
            currentNotifications.map((notification) => [
              notification.id,
              notification,
            ]),
          );

          page.content.forEach((notification) => {
            mergedNotifications.set(notification.id, notification);
          });

          return Array.from(mergedNotifications.values());
        });
        setNextPage(page.number + 1);
        setHasNext(!page.last);
      } catch (caughtError) {
        if (requestId === requestIdRef.current) {
          setError(caughtError);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          isLoadingRef.current = false;
          setLoadingMode(null);
        }
      }
    },
    [],
  );

  const loadInitial = useCallback(async () => {
    await requestPage(0, "initial");
  }, [requestPage]);

  const refresh = useCallback(async () => {
    await requestPage(0, "refresh");
  }, [requestPage]);

  const loadMore = useCallback(async () => {
    if (!hasNext || isLoadingRef.current) return;
    await requestPage(nextPage, "more");
  }, [hasNext, nextPage, requestPage]);

  // 알림 화면에 들어올 때 첫 페이지를 최신 상태로 다시 조회한다.
  useFocusEffect(
    useCallback(() => {
      void loadInitial();
    }, [loadInitial]),
  );

  // 푸시를 받은 경우 현재 화면의 첫 페이지도 갱신한다.
  useEffect(() => {
    if (
      !isFocused ||
      loadingMode !== null ||
      handledRefreshKeyRef.current === refreshKey
    ) {
      return;
    }

    handledRefreshKeyRef.current = refreshKey;
    void refresh();
  }, [isFocused, loadingMode, refresh, refreshKey]);

  // 읽음 표시는 먼저 바꾸고, API 실패 시 원래 상태로 되돌린다.
  const markRead = useCallback(
    async (notification: NotificationItem) => {
      if (notification.isRead) return;

      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) =>
          currentNotification.id === notification.id
            ? {
                ...currentNotification,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : currentNotification,
        ),
      );
      decrementUnreadCount();

      try {
        const response = await markNotificationRead(notification.id);

        if (!response.data.success) {
          throw new Error(
            response.data.error?.message ?? "알림 읽음 처리에 실패했습니다.",
          );
        }
      } catch (caughtError) {
        setNotifications((currentNotifications) =>
          currentNotifications.map((currentNotification) =>
            currentNotification.id === notification.id
              ? {
                  ...currentNotification,
                  isRead: false,
                  readAt: null,
                }
              : currentNotification,
          ),
        );
        void refreshUnreadCount();
        throw caughtError;
      }
    },
    [decrementUnreadCount, refreshUnreadCount],
  );

  // 모두 읽음도 같은 방식으로 즉시 반영하고 실패 시 복구한다.
  const markAllRead = useCallback(async () => {
    if (isMarkingAllRead) return;

    const previousNotifications = notifications;
    const readAt = new Date().toISOString();

    setIsMarkingAllRead(true);
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt ?? readAt,
      })),
    );
    clearUnreadCount();

    try {
      const response = await markAllNotificationsRead();

      if (!response.data.success) {
        throw new Error(
          response.data.error?.message ?? "모두 읽음 처리에 실패했습니다.",
        );
      }
    } catch (caughtError) {
      setNotifications(previousNotifications);
      void refreshUnreadCount();
      throw caughtError;
    } finally {
      setIsMarkingAllRead(false);
    }
  }, [
    clearUnreadCount,
    isMarkingAllRead,
    notifications,
    refreshUnreadCount,
  ]);

  return {
    notifications,
    hasNext,
    error,
    isInitialLoading: loadingMode === "initial" && notifications.length === 0,
    isRefreshing: loadingMode === "refresh",
    isLoadingMore: loadingMode === "more",
    isMarkingAllRead,
    refresh,
    loadMore,
    markRead,
    markAllRead,
  };
};
