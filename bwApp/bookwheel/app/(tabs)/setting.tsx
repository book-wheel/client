import { router } from "expo-router";
import { common } from "@/styles/common";
import { View, Text, TouchableOpacity } from "react-native";

export default function Settings() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>설정 화면</Text>

      {/* 로그아웃 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 16 }]}
        onPress={() => router.replace("../auth/login")}
      >
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}
