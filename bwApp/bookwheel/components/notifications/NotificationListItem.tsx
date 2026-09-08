import type { NotificationItem } from "@/types/notifications";
import { getRelativeTime } from "@/components/utils/date";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type NotificationListItemProps = {
  notification: NotificationItem;
  onPress: () => void;
  onMarkRead: () => void;
};

// 알림 종류에 따라 목록 왼쪽 아이콘만 바꾼다.
const getNotificationIcon = (type: NotificationItem["type"]): IoniconName => {
  if (type === "POST_COMMENTED") return "chatbubble-ellipses-outline";
  if (type === "POST_LIKED" || type === "REVIEW_LIKED") {
    return "heart-outline";
  }
  if (type === "USER_BANNED") return "warning-outline";
  if (type === "ACCOUNT_DEACTIVATED") return "person-remove-outline";
  if (type.startsWith("ROUND_") || type.includes("WHEEL")) {
    return "sync-outline";
  }
  if (type === "READ_ORDER_ASSIGNED") return "list-outline";

  return "people-outline";
};

export default function NotificationListItem({
  notification,
  onPress,
  onMarkRead,
}: NotificationListItemProps) {
  const content = (
    <Pressable
      accessibilityLabel={`${notification.title}. ${notification.body}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        !notification.isRead && styles.unreadContainer,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={getNotificationIcon(notification.type)}
          size={23}
          color="#8A642B"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              !notification.isRead && styles.unreadTitle,
            ]}
          >
            {notification.title}
          </Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>

        <Text numberOfLines={2} style={styles.body}>
          {notification.body}
        </Text>
        <Text style={styles.time}>{getRelativeTime(notification.createdAt)}</Text>
      </View>
    </Pressable>
  );

  // 이미 읽은 알림은 다시 읽음 처리할 필요가 없다.
  if (notification.isRead) return content;

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable
          accessibilityLabel={`${notification.title} 읽음 처리`}
          accessibilityRole="button"
          onPress={onMarkRead}
          style={styles.readAction}
        >
          <Ionicons name="checkmark" size={22} color="#FFFFFF" />
          <Text style={styles.readActionText}>읽음</Text>
        </Pressable>
      )}
      rightThreshold={40}
    >
      {content}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 112,
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
  },
  unreadContainer: {
    backgroundColor: "#FFF9F0",
  },
  pressed: {
    opacity: 0.65,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EDE0",
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flexShrink: 1,
    color: "#513A11",
    fontSize: 15,
    fontWeight: "600",
  },
  unreadTitle: {
    fontWeight: "800",
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E4A54E",
  },
  body: {
    marginTop: 6,
    color: "#5F5A52",
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    marginTop: 7,
    color: "#A19681",
    fontSize: 12,
  },
  readAction: {
    width: 82,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: "#8A642B",
  },
  readActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
