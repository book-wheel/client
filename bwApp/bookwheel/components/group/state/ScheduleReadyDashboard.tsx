import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import type { GroupMember } from "@/types/groupMembers";
import type { GroupScheduleData } from "@/types/groupDashboard";

type Props = {
  id: string;
  schedule: GroupScheduleData;
  members: GroupMember[];
};

export default function ScheduleReadyDashboard({
  id,
  schedule,
  members,
}: Props) {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
    >
      {/* 헤더 */}
      <View style={{ marginBottom: 24 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#FFF3D8",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Ionicons name="checkmark" size={27} color="#E4A54E" />
        </View>

        <Text
          style={{
            fontSize: 25,
            fontWeight: "700",
            color: "#513A11",
          }}
        >
          독서 일정이 완성됐어요!
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            lineHeight: 21,
            color: "#888",
          }}
        >
          멤버들의 읽기 순서와 도서를 기준으로{"\n"}
          함께 읽을 일정이 정해졌어요.
        </Text>
      </View>

      {/* 시작일 */}
      <View
        style={{
          padding: 20,
          borderRadius: 18,
          backgroundColor: "#FFF8E8",
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#A68D63",
            fontWeight: "600",
          }}
        >
          독서 시작일
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 22,
            fontWeight: "700",
            color: "#513A11",
          }}
        >
          {schedule.startDate}
        </Text>

        <Text
          style={{
            marginTop: 5,
            fontSize: 13,
            color: "#8B6D3A",
          }}
        >
          라운드당 {schedule.readingPeriod}일
        </Text>
      </View>

      {/* 참여 멤버 */}
      <View
        style={{
          padding: 20,
          borderRadius: 18,
          backgroundColor: "#FFF",
          borderWidth: 1,
          borderColor: "#F0E5D2",
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: "#513A11",
            marginBottom: 14,
          }}
        >
          참여 멤버 {members.length}명
        </Text>

        {members.map((member, index) => (
          <View
            key={member.memberId}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              borderBottomWidth: index === members.length - 1 ? 0 : 1,
              borderBottomColor: "#F4EFE7",
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#FFF3D8",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#B8873D",
                }}
              >
                {member.readOrder ?? index + 1}
              </Text>
            </View>

            <Text
              style={{
                marginLeft: 10,
                fontSize: 15,
                fontWeight: "600",
                color: "#513A11",
              }}
            >
              {member.nickname}
            </Text>
          </View>
        ))}
      </View>

      {/* 읽기 일정 */}
      <View
        style={{
          padding: 20,
          borderRadius: 18,
          backgroundColor: "#FFF",
          borderWidth: 1,
          borderColor: "#F0E5D2",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: "#513A11",
            marginBottom: 16,
          }}
        >
          읽기 일정
        </Text>

        {schedule.rounds.map((round) => (
          <View
            key={round.roundNumber}
            style={{
              paddingVertical: 13,
              borderBottomWidth:
                round.roundNumber === schedule.rounds.length ? 0 : 1,
              borderBottomColor: "#F4EFE7",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: "#B8873D",
              }}
            >
              ROUND {round.roundNumber}
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontSize: 16,
                fontWeight: "600",
                color: "#513A11",
              }}
            >
              {round.bookTitle}
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 13,
                color: "#888",
              }}
            >
              {round.startDate} ~ {round.endDate}
            </Text>

            <Text
              style={{
                marginTop: 3,
                fontSize: 12,
                color: "#A68D63",
              }}
            >
              {round.senderNickname}의 책
            </Text>
          </View>
        ))}
      </View>

      {/* 수정 */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/group/[id]/member-order-edit",
            params: { id },
          })
        }
        activeOpacity={0.8}
        style={{
          height: 52,
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF8E8",
          borderWidth: 1,
          borderColor: "#EFDDBD",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#B8873D",
          }}
        >
          읽기 순서 다시 지정
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/group/[id]/add-book",
            params: { id },
          })
        }
        activeOpacity={0.8}
        style={{
          height: 52,
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#E4A54E",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#FFF",
          }}
        >
          책 다시 등록하기
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
