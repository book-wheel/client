import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { common } from "@/styles/common";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>책바퀴 홈</Text>

      {/* 알림보기 */}
      <TouchableOpacity onPress={() => router.push("/notifications")}>
        <Text style={[common.button, { marginTop: 20 }]}>알림 보기</Text>
      </TouchableOpacity>

      {/* 완독인증버튼 */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/group/[id]/state",
            params: { id: "3" },
          })
        }
      >
        <Text style={[common.button, { marginTop: 20 }]}>완독인증하기</Text>
      </TouchableOpacity>

      {/* (그룹)전체보기 */}
      <TouchableOpacity onPress={() => router.push("/(tabs)/groups")}>
        <Text style={[common.button, { marginTop: 20 }]}>전체보기</Text>
      </TouchableOpacity>
    </View>
  );
}
