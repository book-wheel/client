import { router, useLocalSearchParams } from "expo-router";
import { common } from "@/styles/common";
import { View, Text, TouchableOpacity } from "react-native";

export default function CompletedBooks() {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const handleComplete = () => {
    router.push({
      pathname: "/group/[id]/state",
      params: { id, completed: "true" },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>완독 인증</Text>

      {/* 완독 */}
      <TouchableOpacity onPress={handleComplete}>
        <Text style={[common.button, { marginTop: 20 }]}>완독</Text>
      </TouchableOpacity>
    </View>
  );
}
