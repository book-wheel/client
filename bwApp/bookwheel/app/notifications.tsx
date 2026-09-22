import { showApiError } from "@/api/axios";
import NotificationList from "@/components/notifications/NotificationList";
import { useNotificationContext } from "@/contexts/notifications";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationItem } from "@/types/notifications";
import { navigateFromNotification } from "@/utils/notificationNavigation";
import { Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Notification() {
  const { unreadCount } = useNotificationContext();
  const {
    notifications,
    error,
    isInitialLoading,
    isRefreshing,
    isLoadingMore,
    isMarkingAllRead,
    refresh,
    loadMore,
    markRead,
    markAllRead,
  } = useNotifications();

  const handleNotificationMarkRead = (notification: NotificationItem) => {
    if (!notification.isRead) {
      void markRead(notification).catch((caughtError) => {
        showApiError(caughtError, "알림을 읽음 처리하지 못했습니다.");
      });
    }
  };

  // 행을 누르면 읽음 처리 후 알림 종류에 맞는 화면으로 이동한다.
  const handleNotificationPress = (notification: NotificationItem) => {
    handleNotificationMarkRead(notification);

    void navigateFromNotification({
      ...(notification.data ?? {}),
      type: notification.type,
      deepLink:
        notification.deepLink ?? notification.data?.deepLink ?? undefined,
    });
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
    } catch (caughtError) {
      showApiError(caughtError, "모두 읽음 처리에 실패했습니다.");
    }
  };

  const isMarkAllDisabled = unreadCount === 0 || isMarkingAllRead;

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: "알림",
          headerRight: () => (
            <Pressable
              accessibilityLabel="모든 알림 읽음 처리"
              accessibilityRole="button"
              disabled={isMarkAllDisabled}
              hitSlop={10}
              onPress={() => void handleMarkAllRead()}
            >
              <Text
                style={[
                  styles.markAllText,
                  isMarkAllDisabled && styles.markAllDisabledText,
                ]}
              >
                모두 읽음
              </Text>
            </Pressable>
          ),
        }}
      />

      <NotificationList
        notifications={notifications}
        error={error}
        isInitialLoading={isInitialLoading}
        isRefreshing={isRefreshing}
        isLoadingMore={isLoadingMore}
        onRefresh={() => void refresh()}
        onLoadMore={() => void loadMore()}
        onNotificationPress={handleNotificationPress}
        onNotificationMarkRead={handleNotificationMarkRead}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  markAllText: {
    color: "#8A642B",
    fontSize: 14,
    fontWeight: "700",
  },
  markAllDisabledText: {
    color: "#C7BBA8",
  },
});
