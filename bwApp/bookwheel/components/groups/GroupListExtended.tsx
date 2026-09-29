import { View, Text, StyleSheet, Pressable } from "react-native";
import { Group } from "./MyGroupList";
import { STATUS_CONFIG } from "@/constants/groupStatus";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Group as BaseGroup } from "./MyGroupList";

export type ExtendedGroup = BaseGroup & {
  description: string;
  isPrivate: boolean;

  bottomButtonType?: "JOIN" | "PENDING" | "JOINED" | "LEADER_SETTING";
};

type Props = {
  group: ExtendedGroup;
  onJoin?: (group: ExtendedGroup) => void;

  isPending?: boolean;
  isJoined?: boolean;
  isOwner?: boolean;
};

export default function GroupListExtended({
  group,
  onJoin,
  isPending,
  isJoined,
  isOwner,
}: Props) {
  const config = STATUS_CONFIG[group.status];
  const statusText = config.label(group.dday ?? undefined);

  return (
    <Pressable
      style={styles.row}
      onPress={() => {
        if (
          group.bottomButtonType === "JOINED" ||
          group.bottomButtonType === "LEADER_SETTING"
        ) {
          return;
        }

        router.push({
          pathname: "/(tabs)/group/[id]/(top)/home",
          params: { id: group.id },
        });
      }}
    >
      <View style={styles.left}>
        {/* 뱃지 줄 */}
        <View style={styles.badgeRow}>
          {group.isPrivate && (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={12} color="#A19681" />
            </View>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {group.isOffline ? "오프라인" : "온라인"}
            </Text>
          </View>

          {group.isOffline && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{group.region}</Text>
            </View>
          )}
        </View>

        {/* 제목 */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {group.title}
          </Text>
        </View>

        {/* 소개 */}
        <Text style={styles.desc} numberOfLines={2}>
          {`" `}
          {group.description}
          {` "`}
        </Text>
        <View style={styles.peopleRow}>
          <Ionicons
            name="people-outline"
            size={14}
            color="#777"
            style={{ marginRight: 4 }}
          />

          <Text style={styles.people}>
            <Text style={styles.count}>
              {group.current} / {group.maxPeople}
            </Text>

            {group.startDate && (
              <>
                <Text style={styles.dot}> ‧ </Text>
                <Text style={styles.date}>{group.startDate}일 시작 예정</Text>
              </>
            )}
          </Text>
        </View>
      </View>

      {/* 오른쪽 */}
      <View style={styles.right}>
        <View style={styles.joinBox}>
          <Pressable
            style={[
              styles.joinBtn,
              isPending && styles.pendingBtn,
              (isJoined || isOwner) && styles.joinedBtn,
            ]}
            onPress={(e) => {
              e.stopPropagation();

              if (isPending || isJoined || isOwner) return;

              onJoin?.(group);
            }}
          >
            <Text style={styles.joinText}>
              {isOwner
                ? "내 모임"
                : isJoined
                  ? "가입됨"
                  : isPending
                    ? "신청중"
                    : "가입"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0E6D8",
  },

  left: {
    flex: 1,
    marginRight: 12,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  badge: {
    backgroundColor: "#F3F0EB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },

  lockBadge: {
    padding: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    fontSize: 11,
    color: "#A19681",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  statusBadge: {
    height: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#513A11",
  },

  desc: {
    fontSize: 13,
    color: "#7A6F5C",
    lineHeight: 18,
  },

  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  peopleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  people: {
    fontSize: 12,
    color: "#999",
  },

  count: {
    color: "#555",
    fontWeight: "600",
  },

  dot: {
    color: "#bbb",
  },

  date: {
    color: "#E4A54E",
    fontWeight: "600",
  },

  joinBox: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  joinBtn: {
    backgroundColor: "#E4A54E",
    paddingHorizontal: 26,
    paddingVertical: 8,
    borderRadius: 5,
  },

  joinedBtn: {
    backgroundColor: "#E5E5E5",
  },

  joinText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#513a118a",
  },
  pendingBtn: {
    backgroundColor: "#FCF5D7",
  },
});
