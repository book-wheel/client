import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  intro: string;
  rules: string;

  currentMembers: number;
  maxMembers: number;

  isOffline: boolean;
};

export default function GroupIntro({
  intro,
  rules,
  currentMembers,
  maxMembers,
  isOffline,
}: Props) {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
      {/* 상단 정보 카드 */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 18,
          borderWidth: 1,
          borderColor: "#F1ECE4",
          marginBottom: 18,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <InfoItem
            icon="people-outline"
            label="인원"
            value={`${currentMembers}/${maxMembers}`}
          />

          <InfoItem
            icon="location-outline"
            label="방식"
            value={isOffline ? "오프라인" : "온라인"}
          />
        </View>
      </View>

      {/* 소개 카드 */}
      <View
        style={{
          backgroundColor: "#FFF",
          borderRadius: 20,
          padding: 22,
          borderWidth: 1,
          borderColor: "#F1ECE4",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#A08A5B",
            marginBottom: 10,
            fontWeight: "600",
          }}
        >
          모임 소개
        </Text>

        <Text
          style={{
            color: "#513A11",
            fontWeight: "700",
            fontSize: 17,
            lineHeight: 26,
          }}
        >
          {intro}
        </Text>
      </View>

      {/* 규칙 */}
      <View
        style={{
          marginTop: 22,
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: "#F1ECE4",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Ionicons
            name="bookmark-outline"
            size={18}
            color="#A08A5B"
            style={{ marginRight: 6 }}
          />

          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#513A11",
            }}
          >
            모임 규칙
          </Text>
        </View>

        <Text
          style={{
            color: "#6B5B3E",
            lineHeight: 24,
            fontSize: 14,
          }}
        >
          {rules}
        </Text>
      </View>
    </View>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", width: "48%" }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#FFF8ED",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        <Ionicons name={icon} size={18} color="#A08A5B" />
      </View>

      <View>
        <Text
          style={{
            fontSize: 12,
            color: "#999",
            marginBottom: 2,
          }}
        >
          {label}
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#513A11",
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
