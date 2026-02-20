import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import Button from "@/components/Button";
import MemberRow from "@/components/member/MemberRow";

export default function Home() {
  const navigation = useNavigation();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  useEffect(() => {
    navigation.getParent()?.setOptions({ title: name });
    navigation.getParent()?.getParent()?.setOptions({ title: name });
  }, [name]);

  //가입신청자 목데이터
  type Applicant = {
    id: string;
    name: string;
  };

  const mockApplicants: Applicant[] = [
    { id: "1", name: "김주옥" },
    // { id: "2", name: "사토 유키" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* 상단 영역 */}
      <View style={{ alignItems: "center", marginTop: 54 }}>
        <View
          style={{
            backgroundColor: "#FFFCF3",
            borderRadius: 5,
            padding: 20,
            height: 82,
            width: 337,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#513A11", fontWeight: "bold", fontSize: 15 }}>
            " 소개 "
          </Text>
        </View>
      </View>

      {/* 중간 영역 */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        {/* 모임 규칙 */}
        <View style={{ width: "100%", marginBottom: 34 }}>
          <Text
            style={{
              fontSize: 18,
              marginLeft: 26,
              marginBottom: 16,
              fontWeight: "bold",
              color: "#513A11",
            }}
          >
            모임 규칙
          </Text>

          <Text style={{ marginLeft: 26, color: "#513A11" }}>
            1. 뭐시기{"\n"}2. 뭐시기
          </Text>
        </View>
      </View>

      {/* 하단 가입신청 및 채팅방 버튼 */}
      <View style={{ paddingBottom: 12, alignItems: "center", width: "100%" }}>
        <View style={{ width: "100%", paddingHorizontal: 20 }}>
          {/* 제목 */}
          <Text
            style={{
              fontSize: 18,
              marginBottom: 12,
              fontWeight: "bold",
              color: "#513A11",
            }}
          >
            가입 신청
          </Text>

          {/* 조건부 렌더링 */}
          {mockApplicants.length === 0 ? (
            <View
              style={{
                // backgroundColor: "#FFFCF3",
                borderRadius: 8,
                paddingVertical: 24,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  color: "#A08A5B",
                  fontSize: 14,
                  fontStyle: "italic",
                }}
              >
                가입신청이 없어요
              </Text>
            </View>
          ) : (
            mockApplicants.map((member, index) => (
              <View key={member.id} style={{ marginBottom: 8 }}>
                <MemberRow
                  name={member.name}
                  buttonText="보기"
                  onPress={() => console.log("신청자:", member.name)}
                  variant="home"
                />
              </View>
            ))
          )}
        </View>
        <Button
          title="채팅방"
          onPress={() => router.push("/group/[id]/chatroom")}
          color="#FCF5D7"
        />
      </View>
    </View>
  );
}
