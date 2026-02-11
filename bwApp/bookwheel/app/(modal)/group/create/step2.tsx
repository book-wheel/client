import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";
import { router } from "expo-router";

export default function Step2() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 다음 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 16 }]}
        onPress={() => router.replace("./step3")}
      >
        <Text>다음</Text>
      </TouchableOpacity>

      {/* 이전 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 16 }]}
        onPress={() => router.replace("./step1")}
      >
        <Text>이전</Text>
      </TouchableOpacity>
    </View>
  );
}
