import {
  getUnreadNotificationCount,
  markNotificationRead,
} from "@/api/notifications";
import { registerForPushNotifications } from "@/services/pushNotifications";
import type { NotificationNavigationPayload } from "@/types/notifications";
import { navigateFromNotification } from "@/utils/notificationNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { router, usePathname } from "expo-router";
import { AppState, Platform } from "react-native";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Context: 헤더 배지와 푸시 이벤트처럼 앱 전체가 함께 쓰는 알림 상태를 관리한다.
type NotificationContextValue = {
  unreadCount: number;
  refreshKey: number;
  refreshUnreadCount: () => Promise<void>;
  decrementUnreadCount: (amount?: number) => void;
  clearUnreadCount: () => void;
  signalNotificationsChanged: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

const isLoggedOutRoute = (pathname: string) => {
  return (
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/idfind" ||
    pathname === "/auth/pwfind" ||
    pathname === "/intro"
  );
};

const getNotificationPayload = (
  response: Notifications.NotificationResponse,
) => {
  return response.notification.request.content
    .data as NotificationNavigationPayload;
};

export function NotificationProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // 같은 사용자에게 중복 등록하거나 같은 푸시를 중복 처리하지 않도록 기억한다.
  const registeredAccessTokenRef = useRef<string | null>(null);
  const isRegisteringPushRef = useRef(false);
  const pendingResponseRef =
    useRef<Notifications.NotificationResponse | null>(null);
  const isProcessingResponseRef = useRef(false);

  // 헤더 배지는 목록 개수가 아니라 서버의 미읽음 개수를 기준으로 맞춘다.
  const refreshUnreadCount = useCallback(async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");

    if (!accessToken) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await getUnreadNotificationCount();
      const result = response.data;

      if (result.success && result.data) {
        setUnreadCount(Math.max(0, result.data.unreadCount));
      }
    } catch (error) {
      console.error("읽지 않은 알림 개수 조회 실패:", error);
    }
  }, []);

  const decrementUnreadCount = useCallback((amount = 1) => {
    setUnreadCount((currentCount) => Math.max(0, currentCount - amount));
  }, []);

  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const signalNotificationsChanged = useCallback(() => {
    setRefreshKey((currentKey) => currentKey + 1);
    void refreshUnreadCount();
  }, [refreshUnreadCount]);

  // 권한 확인과 Expo 토큰 등록은 사용자별로 한 번씩 수행한다.
  const registerPushForUser = useCallback(
    async (accessToken: string, force = false) => {
      if (
        isRegisteringPushRef.current ||
        (!force && registeredAccessTokenRef.current === accessToken)
      ) {
        return;
      }

      isRegisteringPushRef.current = true;
      registeredAccessTokenRef.current = accessToken;

      try {
        await registerForPushNotifications();
      } catch (error) {
        registeredAccessTokenRef.current = null;
        console.error("푸시 알림 등록 실패:", error);
      } finally {
        isRegisteringPushRef.current = false;
      }
    },
    [],
  );

  // 푸시를 누르면 읽음 처리 후 알림 종류에 맞는 화면으로 이동한다.
  const processPendingResponse = useCallback(async () => {
    const response = pendingResponseRef.current;

    if (!response || isProcessingResponseRef.current) return;

    isProcessingResponseRef.current = true;

    try {
      const payload = getNotificationPayload(response);
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (payload.type === "ACCOUNT_DEACTIVATED") {
        pendingResponseRef.current = null;
        await navigateFromNotification(payload);
        return;
      }

      if (!accessToken) {
        router.replace("/auth/login");
        return;
      }

      pendingResponseRef.current = null;
      const notificationId = Number(payload.notificationId);

      if (Number.isInteger(notificationId) && notificationId > 0) {
        await markNotificationRead(notificationId).catch((error) => {
          console.error("푸시 알림 읽음 처리 실패:", error);
        });
      }

      signalNotificationsChanged();
      await navigateFromNotification(payload);
    } catch (error) {
      console.error("푸시 알림 이동 처리 실패:", error);
    } finally {
      isProcessingResponseRef.current = false;

      if (
        pendingResponseRef.current &&
        pendingResponseRef.current !== response
      ) {
        void processPendingResponse();
      }
    }
  }, [signalNotificationsChanged]);

  const queueNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      pendingResponseRef.current = response;
      void Notifications.clearLastNotificationResponseAsync();
      void processPendingResponse();
    },
    [processPendingResponse],
  );

  // 로그인 사용자로 화면이 바뀌면 배지와 푸시 토큰을 동기화한다.
  useEffect(() => {
    if (isLoggedOutRoute(pathname)) {
      registeredAccessTokenRef.current = null;
      setUnreadCount(0);
      return;
    }

    let isActive = true;

    const syncAuthenticatedNotifications = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (!isActive) return;

      if (!accessToken) {
        registeredAccessTokenRef.current = null;
        setUnreadCount(0);
        await processPendingResponse();
        return;
      }

      void refreshUnreadCount();

      await registerPushForUser(accessToken);

      await processPendingResponse();
    };

    void syncAuthenticatedNotifications();

    return () => {
      isActive = false;
    };
  }, [
    pathname,
    processPendingResponse,
    refreshUnreadCount,
    registerPushForUser,
  ]);

  // 푸시 수신·누름·토큰 변경 이벤트는 앱이 켜져 있는 동안 계속 듣는다.
  useEffect(() => {
    if (Platform.OS === "web") return;

    const receivedSubscription =
      Notifications.addNotificationReceivedListener(() => {
        signalNotificationsChanged();
      });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        queueNotificationResponse,
      );

    const pushTokenSubscription = Notifications.addPushTokenListener(() => {
      void AsyncStorage.getItem("accessToken").then((accessToken) => {
        if (!accessToken) return;

        void registerPushForUser(accessToken, true);
      });
    });

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) queueNotificationResponse(response);
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
      pushTokenSubscription.remove();
    };
  }, [
    queueNotificationResponse,
    registerPushForUser,
    signalNotificationsChanged,
  ]);

  // 앱으로 돌아오면 OS 권한 변경과 새 알림을 다시 확인한다.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refreshUnreadCount();
        void processPendingResponse();
        void AsyncStorage.getItem("accessToken").then((accessToken) => {
          if (accessToken) void registerPushForUser(accessToken, true);
        });
      }
    });

    return () => subscription.remove();
  }, [processPendingResponse, refreshUnreadCount, registerPushForUser]);

  const value = useMemo(
    () => ({
      unreadCount,
      refreshKey,
      refreshUnreadCount,
      decrementUnreadCount,
      clearUnreadCount,
      signalNotificationsChanged,
    }),
    [
      unreadCount,
      refreshKey,
      refreshUnreadCount,
      decrementUnreadCount,
      clearUnreadCount,
      signalNotificationsChanged,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext는 NotificationProvider 안에서 사용해야 합니다.",
    );
  }

  return context;
};
