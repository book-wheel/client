import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import type { MyGroupStatus } from "@/types/group";

type Props = {
  id: string;
  status: MyGroupStatus;
  dday: number | null;
  name: string;
  memberCount: string;
  type: string;
  regen: string;
  info: string;
};

export default function ReadingCard({
  id,
  status,
  dday,
  name,
  memberCount,
  type,
  regen,
  info,
}: Props) {
  const isRescheduleRequired = status === "reschedule_required";
  const statusText =
    status === "active"
      ? "진행 중"
      : status === "done"
        ? "종료"
        : isRescheduleRequired
          ? "일정 재설정 필요"
          : dday === 0
            ? "D-Day"
            : `D-${dday ?? "?"}`;

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/group/[id]/(top)/home",
          params: { id, name },
        })
      }
    >
      {/* 상단 */}
      <View style={styles.topColumn}>
        <View style={styles.ddayBadge}>
          <Text
            style={[
              styles.ddayText,
              isRescheduleRequired && styles.rescheduleText,
            ]}
          >
            {statusText}
          </Text>
        </View>

        <Text style={styles.title}>{`< ${name} >`}</Text>
        <Text style={styles.member}>{memberCount}</Text>

        {/* 온라인 / 오프라인 */}
        <View style={styles.row}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{type}</Text>
          </View>

          {/* 오프라인일 때만 지역 표시 */}
          {type !== "온라인" && regen && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{regen}</Text>
            </View>
          )}
        </View>
      </View>

      {/* 모임 소개 */}
      <View style={styles.bottom}>
        <Text style={styles.label}>모임 소개</Text>
        <Text style={styles.info}>{info}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 153,
    height: 291,
    backgroundColor: "#FFFCF3",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderColor: "#513A11",
    borderWidth: 1,
    alignSelf: "center",
  },

  topColumn: {
    width: "100%",
    alignSelf: "center",
  },

  ddayBadge: {
    alignSelf: "center",
    width: "80%",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#FCF5D7",
    marginBottom: 16,
  },

  ddayText: {
    fontSize: 18,
    color: "#E4A54E",
    fontWeight: "600",
    alignSelf: "center",
  },

  rescheduleText: {
    fontSize: 13,
  },

  title: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#513A11",
    marginBottom: 4,
  },

  member: {
    alignSelf: "center",
    fontSize: 14,
    color: "#7B6A4A",
  },
  row: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 6,
    gap: 10,
  },

  typeBadge: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#FCF5D7",
    borderColor: "#513A11",
    borderWidth: 1,
  },

  typeText: {
    fontSize: 12,
    color: "#513A11",
    fontWeight: "600",
  },

  bottom: {
    marginTop: 12,
  },

  label: {
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
  },

  info: {
    fontSize: 12,
    color: "#513A11",
    lineHeight: 16,
  },
});
