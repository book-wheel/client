import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";
import { router } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 채팅방 */}
      <TouchableOpacity onPress={() => router.push("/group/[id]/chatroom")}>
        <Text style={[common.button, { marginTop: 20 }]}>채팅방</Text>
      </TouchableOpacity>
    </View>
  );
}
