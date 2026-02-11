import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";
import { router } from "expo-router";

export default function AddBook() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>책 등록</Text>

      {/* 등록 */}
      <TouchableOpacity onPress={() => router.replace("/group/[id]/state")}>
        <Text style={[common.button, { marginTop: 20 }]}>등록</Text>
      </TouchableOpacity>
    </View>
  );
}
