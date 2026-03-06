import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";

export default function Review() {
  const groupId = "1";

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 15 }}>책 리뷰</Text>

      {/* 게시물 등록 */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/group/[id]/completed-books",
              params: { id: groupId },
            })
          }
        >
          <AntDesign name="arrows-alt" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
