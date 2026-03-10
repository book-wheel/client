import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default {
  headerTitleAlign: "left" as const,

  headerTitle: () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("@/assets/images/logo-clear.png")}
        style={{ width: 35, height: 35, marginRight: 6 }}
      />

      <Text style={{ color: "#513A11", fontSize: 23, fontWeight: "bold" }}>
        책바퀴
      </Text>
    </View>
  ),

  headerRight: () => (
    <TouchableOpacity
      onPress={() => router.push("/notifications")}
      style={{ marginRight: 25 }}
    >
      <Ionicons name="notifications-outline" size={25} color="#513A11" />
    </TouchableOpacity>
  ),
};
