import { router, useLocalSearchParams } from "expo-router";
import { common } from "@/styles/common";
import { View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import { Ionicons } from "@expo/vector-icons";

export default function Gallery() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const groupId = "1";

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>책 갤러리</Text>

      {/* 게시물로 이동 */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "../[galleryId]/post",
            params: {
              bookId,
              galleryId: "1",
            },
          })
        }
      >
        <Text style={[common.button, { marginTop: 20 }]}>책사진1</Text>
      </TouchableOpacity>

      {/* 게시물로 생성 */}
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
          <Ionicons name="add-circle-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
