import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import ProgressBlocks from "@/components/groups/progress";
import ReadingCard from "@/components/home/ReadingCard";
import MemberRow from "@/components/member/MemberRow";

type MemberStatus = {
  id: string;
  name: string;
  bookTitle: string;
  role: "leader" | "vice" | "member";
  status: "completed" | "exchanging" | "reading" | "ready";
};

const mockMembers: MemberStatus[] = [
  {
    id: "1",
    name: "김주옥",
    role: "leader",
    bookTitle: "해리포터와 마법사의 돌",
    status: "reading",
  },
  {
    id: "2",
    name: "사토 유키",
    role: "vice",
    bookTitle: "노르웨이의 숲",
    status: "completed",
  },
  {
    id: "3",
    name: "이준호",
    role: "member",
    bookTitle: "데미안",
    status: "exchanging",
  },
  {
    id: "4",
    name: "박서연",
    role: "member",
    bookTitle: "어린 왕자",
    status: "ready",
  },
];

export default function State() {
  const { id: rawId, memberId, newStatus } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const session = 3;
  const totalMembers = mockMembers.length;
  const completedMembers = mockMembers.filter(
    (m) => m.status === "completed",
  ).length;

  //상태관리
  const [members, setMembers] = useState<MemberStatus[]>(mockMembers);

  const updateMemberStatus = (id: string, status: MemberStatus["status"]) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const currentMember = members.find((m) => m.id === "1");

  const handleCardButtonPress = () => {
    if (!currentMember) return;

    if (currentMember.status === "reading") {
      router.push({
        pathname: "/group/[id]/completed-books",
        params: { id, memberId: "1" },
      });
    } else if (currentMember.status === "completed") {
      updateMemberStatus("1", "ready");
    } else if (currentMember.status === "ready") {
      router.push({
        pathname: "/group/[id]/this-session",
        params: { id },
      });
    }
  };

  const getButtonText = () => {
    if (!currentMember) return "완독 인증 하기";

    switch (currentMember.status) {
      case "reading":
        return "완독 인증 하기";
      case "completed":
        return "전달 완료";
      case "ready":
        return "준비 완료";
      default:
        return "완독 인증 하기";
    }
  };

  useEffect(() => {
    if (memberId && newStatus) {
      updateMemberStatus(
        Array.isArray(memberId) ? memberId[0] : memberId,
        newStatus as MemberStatus["status"],
      );
    }
  }, [memberId, newStatus]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* 상단: 회차 + 진행률 */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#513A11",
            marginBottom: 12,
          }}
        >
          {session}회차 독서 진행중
        </Text>

        <ProgressBlocks
          total={totalMembers}
          current={completedMembers}
          width={null}
          height={18}
        />
      </View>

      {/* 진행중인 도서 */}
      <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#513A11",
            marginBottom: 12,
          }}
        >
          진행중인 도서
        </Text>

        <ReadingCard
          image={require("@/assets/images/book.png")}
          title="해리포터와 마법사의 돌"
          author="J.K. 롤링"
          owner="김주옥"
          buttonText={getButtonText()}
          onPress={handleCardButtonPress}
        />
      </View>

      {/* 멤버별 상황 */}
      <View style={{ paddingHorizontal: 20, marginTop: 32, marginBottom: 40 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#513A11",
            marginBottom: 12,
          }}
        >
          멤버별 상황
        </Text>

        {mockMembers.map((member) => (
          <View key={member.id} style={{ marginBottom: 8 }}>
            <MemberRow
              key={member.id}
              name={member.name}
              role={member.role}
              bookTitle={member.bookTitle}
              showBook
              status={member.status}
              buttonText=""
              variant="status"
              onPress={() => {}}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
