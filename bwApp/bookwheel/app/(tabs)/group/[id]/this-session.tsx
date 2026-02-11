import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";
import { router } from "expo-router";

export default function ThisSession() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>이번 회차에서 읽을 책</Text>

      {/* 독서 시작 */}
      <TouchableOpacity onPress={() => router.replace("/group/[id]/state")}>
        <Text style={[common.button, { marginTop: 20 }]}>독서 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}
