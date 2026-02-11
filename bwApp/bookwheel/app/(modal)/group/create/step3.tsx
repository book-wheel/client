import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";
import { router } from "expo-router";

export default function Step3() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 생성 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 16 }]}
        onPress={() => router.replace("/group/3/home")}
      >
        <Text>생성</Text>
      </TouchableOpacity>

      {/* 이전 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 16 }]}
        onPress={() => router.replace("./step2")}
      >
        <Text>이전</Text>
      </TouchableOpacity>
    </View>
  );
}
