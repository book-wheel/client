import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Intro() {
  return (
    <View>
      <Text>BookWheel</Text>

      <TouchableOpacity onPress={() => router.replace("/auth/login")}>
        <Text>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}
