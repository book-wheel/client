import { getApiErrorMessage } from "@/api/axios";
import NotificationList from "@/components/notifications/NotificationList";
import { useNotificationContext } from "@/contexts/notifications";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationItem } from "@/types/notifications";
import { navigateFromNotification } from "@/utils/notificationNavigation";
import { Stack } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

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
        console.error("알림 읽음 처리 실패:", caughtError);
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
      Alert.alert(
        "알림",
        getApiErrorMessage(caughtError, "모두 읽음 처리에 실패했습니다."),
      );
    }
  };

  const isMarkAllDisabled = unreadCount === 0 || isMarkingAllRead;

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: "알림",
          headerTitleStyle: styles.headerTitle,
          headerTintColor: "#513A11",
          headerShadowVisible: false,
          // 뒤로가기 화살표만 표시
          headerBackButtonDisplayMode: "minimal",
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
  headerTitle: {
    color: "#513A11",
    fontSize: 20,
    fontWeight: "800",
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
