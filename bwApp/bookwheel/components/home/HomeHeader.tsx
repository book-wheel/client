import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNotificationContext } from "@/contexts/notifications";

export function NotificationButton() {
  const { unreadCount } = useNotificationContext();
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <TouchableOpacity
      accessibilityLabel={
        unreadCount > 0
          ? `알림함, 읽지 않은 알림 ${unreadCount}개`
          : "알림함"
      }
      accessibilityRole="button"
      onPress={() => router.push("/notifications")}
      style={styles.notificationButton}
    >
      <Ionicons name="notifications-outline" size={25} color="#513A11" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationButton: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -7,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E26D5A",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    lineHeight: 12,
  },
});
