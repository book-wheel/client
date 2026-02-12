import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { common } from "@/styles/common";

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 30 }}>프로필 설정</Text>

      {/* 프로필 설정 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 16 }]}
        onPress={() => router.replace("../(tabs)")}
      >
        <Text>저장</Text>
      </TouchableOpacity>
    </View>
  );
}
