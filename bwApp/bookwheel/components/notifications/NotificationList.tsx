import { getApiErrorMessage } from "@/api/axios";
import type { NotificationItem } from "@/types/notifications";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import NotificationListItem from "./NotificationListItem";

type NotificationListProps = {
  notifications: NotificationItem[];
  error: unknown;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onNotificationPress: (notification: NotificationItem) => void;
  onNotificationMarkRead: (notification: NotificationItem) => void;
};

type NotificationStateProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

// 빈 목록과 조회 오류가 같은 형태라 이 파일 안에서만 공통으로 사용한다.
function NotificationState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: NotificationStateProps) {
  return (
    <View style={styles.stateContainer}>
      <Ionicons name={icon} size={48} color="#C7BBA8" />
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateDescription}>{description}</Text>

      {actionLabel && onAction && (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

// 목록 UI만 담당하며 API 호출과 읽음 처리는 부모 화면에 맡긴다.
export default function NotificationList({
  notifications,
  error,
  isInitialLoading,
  isRefreshing,
  isLoadingMore,
  onRefresh,
  onLoadMore,
  onNotificationPress,
  onNotificationMarkRead,
}: NotificationListProps) {
  if (isInitialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E4A54E" />
      </View>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <NotificationState
        icon="alert-circle-outline"
        title="알림을 불러오지 못했어요"
        description={getApiErrorMessage(
          error,
          "잠시 후 다시 시도해주세요.",
        )}
        actionLabel="다시 시도"
        onAction={onRefresh}
      />
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(notification) => String(notification.id)}
      renderItem={({ item }) => (
        <NotificationListItem
          notification={item}
          onPress={() => onNotificationPress(item)}
          onMarkRead={() => onNotificationMarkRead(item)}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={
        notifications.length === 0
          ? styles.emptyListContent
          : styles.listContent
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#E4A54E"
          colors={["#E4A54E"]}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.35}
      ListEmptyComponent={
        <NotificationState
          icon="notifications-off-outline"
          title="아직 알림이 없어요"
          description="새로운 소식이 오면 여기에 모아드릴게요."
        />
      }
      ListFooterComponent={
        isLoadingMore ? (
          <ActivityIndicator color="#E4A54E" style={styles.footerLoader} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 28,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 78,
    backgroundColor: "#EEE7DC",
  },
  footerLoader: {
    paddingVertical: 20,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  stateTitle: {
    marginTop: 16,
    color: "#513A11",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  stateDescription: {
    marginTop: 7,
    color: "#A19681",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F7EDE0",
  },
  retryButtonText: {
    color: "#8A642B",
    fontSize: 14,
    fontWeight: "700",
  },
});
