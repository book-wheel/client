import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { common } from "@/styles/common";

export default function PwFind() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 로그인으로 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 16 }]}
        onPress={() => router.replace("/auth/login")}
      >
        <Text>로그인</Text>
      </TouchableOpacity>

      {/* 아이디찾기 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 16 }]}
        onPress={() => router.push("/auth/(tabs)/idfind")}
      >
        <Text>아이디 찾기</Text>
      </TouchableOpacity>
    </View>
  );
}
