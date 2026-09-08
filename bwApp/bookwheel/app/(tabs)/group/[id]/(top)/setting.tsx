import { Ionicons } from "@expo/vector-icons";
import { router, type Href, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type MenuRowProps = {
  label: string;
  onPress?: () => void;
};

function MenuRow({ label, onPress }: MenuRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={[styles.rowLabel, !onPress && styles.disabledLabel]}>
        {label}
      </Text>
      {onPress ? (
        <Ionicons name="chevron-forward" size={16} color="#9B8B6B" />
      ) : (
        <Text style={styles.comingSoon}>준비 중</Text>
      )}
    </Pressable>
  );
}

export default function Setting() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>MY</Text>
      <MenuRow label="내 정보" onPress={() => router.push("/(tabs)/setting")} />

      <Text style={[styles.sectionTitle, styles.groupSectionTitle]}>모임</Text>
      <MenuRow
        label="모임 설정"
        onPress={() => router.push(`/group/${id}/group-settings` as Href)}
      />
      <MenuRow label="멤버 관리" />
      <MenuRow label="일정 관리" />
      <MenuRow label="알림 설정" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 48,
  },
  sectionTitle: {
    marginBottom: 10,
    color: "#513A11",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  groupSectionTitle: {
    marginTop: 28,
  },
  row: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D8C9AB",
    paddingHorizontal: 8,
  },
  rowPressed: {
    backgroundColor: "#FFFBF1",
  },
  rowLabel: {
    color: "#513A11",
    fontSize: 14,
    fontWeight: "500",
  },
  disabledLabel: {
    color: "#A99E8A",
  },
  comingSoon: {
    color: "#B7AB94",
    fontSize: 11,
  },
});
