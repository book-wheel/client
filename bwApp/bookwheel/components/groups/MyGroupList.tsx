import { View, Text, StyleSheet, Pressable } from "react-native";
import ProgressBlocks from "./progress";

import { GroupStatus } from "@/constants/groupStatus";
import { STATUS_CONFIG } from "@/constants/groupStatus";
import { router } from "expo-router";

export type Group = {
  id: string;
  isOffline: boolean;
  region?: string;
  status: GroupStatus;
  startDate?: string;
  dday?: number;
  title: string;
  current: number;
  maxPeople: number;
  role?: "OWNER" | "MEMBER";
};

type Props = {
  group: Group;
};

export default function GroupList({ group }: Props) {
  const config = STATUS_CONFIG[group.status];
  const statusText = config.label(group.dday);

  return (
    <Pressable
      style={styles.row}
      onPress={() =>
        router.replace({
          pathname: "/(tabs)/group/[id]/(top)/home",
          params: {
            id: group.id,
            name: group.title,
          },
        })
      }
    >
      {/* 왼쪽 텍스트 영역 */}
      <View style={styles.left}>
        {/* 온라인 / 오프라인 + 지역 */}
        <View style={styles.badgeRow}>
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

        <View style={styles.mainRow}>
          {/* 상태 */}
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Text style={[styles.statusText, { color: config.text }]}>
              {statusText}
            </Text>
          </View>
          {/* 제목 + 인원 묶음 + 역할 */}
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={1}>
              {group.title}
            </Text>

            {group.role === "OWNER" && (
              <View style={styles.ownerBadge}>
                <Text style={styles.ownerText}>모임장</Text>
              </View>
            )}

            <Text style={styles.people}>
              ( {group.current} / {group.maxPeople} )
            </Text>
          </View>

          {/* 진행률 */}
          {(group.status === "RECRUITING" ||
            group.status === "IN_PROGRESS") && (
            <View style={styles.progressWrap}>
              <ProgressBlocks
                total={group.maxPeople}
                current={group.current}
                width={110}
                height={14}
              />
            </View>
          )}

          {group.status === "COMPLETE" && (
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{group.startDate}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderColor: "#E6DDCF",
    backgroundColor: "#fff",
  },

  left: {
    flex: 1,
    marginRight: 10,
  },

  badgeRow: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 6,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  badge: {
    backgroundColor: "#e5e5e57b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    marginBottom: 18,
  },

  statusBadge: {
    backgroundColor: "#FCF5D7",
    height: 22,
    paddingHorizontal: 13,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
    marginRight: 8,
  },

  badgeText: {
    fontSize: 11,
    color: "#A19681",
  },

  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  titleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 0,
  },
  statusText: {
    fontSize: 12,
    color: "#513A11",
    lineHeight: 16,
    textAlignVertical: "center",
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#513A11",
  },

  people: {
    fontSize: 12,
    color: "#A19681",
    flexShrink: 0,
  },

  progressWrap: {
    marginLeft: 8,
    flexShrink: 0,
  },

  dateBadge: {
    marginLeft: 8,
    minWidth: 110,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#FAEDDC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  dateText: {
    fontSize: 12,
    color: "#513A11",
  },
  ownerBadge: {
    backgroundColor: "#513A11",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  ownerText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },
});
