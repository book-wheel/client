import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import Ionicons from "@expo/vector-icons/Ionicons";

import { getGroupMembers, updateMemberOrder } from "@/api/group";

type Member = {
  memberId: string;
  nickname: string;
  profileImageUrl: string | null;
};

export default function MemberOrderEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMembers = async () => {
      try {
        const response = await getGroupMembers(id);

        setMembers(
          response.members.map((member: Member) => ({
            memberId: member.memberId,
            nickname: member.nickname,
            profileImageUrl: member.profileImageUrl,
          })),
        );
      } catch (error) {
        console.error("멤버 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [id]);

  const handleRandomOrder = async () => {
    if (!id) return;

    try {
      setSaving(true);

      const result = await updateMemberOrder(id, {
        isRandom: true,
      });

      setMembers(
        result.map((member) => ({
          memberId: member.memberId,
          nickname: member.nickname,
          profileImageUrl: member.profileImage,
        })),
      );
    } catch (error) {
      console.error("랜덤 순서 지정 실패:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);

      await updateMemberOrder(id, {
        isRandom: false,
        memberIds: members.map((member) => member.memberId),
      });

      router.back();
    } catch (error) {
      console.error("읽기 순서 저장 실패:", error);
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Member>) => {
    const order = members.findIndex(
      (member) => member.memberId === item.memberId,
    );

    return (
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        activeOpacity={0.9}
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 72,
          paddingHorizontal: 16,
          marginBottom: 10,
          borderRadius: 18,
          backgroundColor: isActive ? "#FFF8E8" : "#FFFFFF",
          borderWidth: 1,
          borderColor: isActive ? "#E4A54E" : "#F0E5D2",
          shadowColor: "#513A11",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 1,
        }}
      >
        {/* 순서 */}
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#FFF3D8",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#B8873D",
            }}
          >
            {order + 1}
          </Text>
        </View>

        {/* 프로필 */}
        <Image
          source={
            item.profileImageUrl
              ? { uri: item.profileImageUrl }
              : require("@/assets/images/logo.png")
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "#F3F3F3",
          }}
        />

        {/* 이름 */}
        <Text
          style={{
            flex: 1,
            marginLeft: 13,
            fontSize: 16,
            fontWeight: "600",
            color: "#513A11",
          }}
          numberOfLines={1}
        >
          {item.nickname}
        </Text>

        {/* 드래그 */}
        <View
          style={{
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="reorder-three-outline" size={25} color="#C7B79D" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF",
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 14,
          }}
        >
          멤버를 불러오는 중...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      {/* 상단 */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 28,
          paddingBottom: 18,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "700",
            color: "#513A11",
          }}
        >
          읽기 순서 지정
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Ionicons name="people-outline" size={16} color="#A68D63" />

          <Text
            style={{
              marginLeft: 5,
              fontSize: 14,
              color: "#8B6D3A",
              fontWeight: "500",
            }}
          >
            참여자 {members.length}명
          </Text>
        </View>

        <View
          style={{
            marginTop: 16,
            paddingVertical: 13,
            paddingHorizontal: 15,
            borderRadius: 12,
            backgroundColor: "#FFF8E8",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={17}
              color="#B8873D"
            />

            <Text
              style={{
                marginLeft: 7,
                fontSize: 13,
                color: "#8B6D3A",
                flex: 1,
              }}
            >
              멤버를 길게 눌러 드래그하면 순서를 변경할 수 있어요.
            </Text>
          </View>
        </View>
      </View>

      {/* 멤버 목록 */}
      <DraggableFlatList
        data={members}
        keyExtractor={(item) => item.memberId}
        renderItem={renderItem}
        onDragEnd={({ data }) => setMembers(data)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      />

      {/* 하단 버튼 */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
          backgroundColor: "#FFF",
          borderTopWidth: 1,
          borderTopColor: "#F4EFE7",
        }}
      >
        <TouchableOpacity
          onPress={handleRandomOrder}
          disabled={saving}
          activeOpacity={0.8}
          style={{
            height: 50,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFF8E8",
            borderWidth: 1,
            borderColor: "#EFDDBD",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="shuffle-outline" size={18} color="#B8873D" />

            <Text
              style={{
                marginLeft: 7,
                color: "#B8873D",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              랜덤으로 정하기
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
          style={{
            height: 54,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#E4A54E",
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {saving ? "저장 중..." : "순서 저장하기"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
