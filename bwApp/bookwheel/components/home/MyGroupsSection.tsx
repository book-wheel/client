import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import MyGroupCard from "@/components/home/MyGroupCard";
import { MyGroup } from "@/types/group";

type Props = {
  groups: MyGroup[];
};

export default function MyGroupsSection({ groups }: Props) {
  return (
    <>
      {/* 제목 */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
          borderTopColor: "#513A11",
          borderTopWidth: 0.3,
          marginTop: 20,
          paddingTop: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 23,
              fontWeight: "bold",
              color: "#513A11",
            }}
          >
            내 모임
          </Text>

          <TouchableOpacity onPress={() => router.push("/(tabs)/groups")}>
            <Text style={{ fontSize: 12, color: "#999" }}>전체보기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 카드 리스트 */}
      {groups.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 15,
            marginTop: 20,
          }}
        >
          {groups.map((group) => (
            <MyGroupCard
              key={group.id}
              id={group.id}
              status={group.status}
              dday={group.dday}
              name={group.name}
              memberCount={group.memberCount}
              type={group.type}
              regen={group.region}
              info={group.info}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={{ color: "#7B6A4A", margin: 20 }}>
          참여 중인 모임이 없어요.
        </Text>
      )}
    </>
  );
}
