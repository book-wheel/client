import { common } from "@/styles/common";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Post() {
  const { bookId, galleryId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>
        책 ID: {bookId}, 갤러리 ID: {galleryId}
      </Text>

      {/* 댓글보기 */}
      <TouchableOpacity onPress={() => router.push("./comment")}>
        <Text style={[common.button, { marginTop: 20 }]}>댓글 보기</Text>
      </TouchableOpacity>
    </View>
  );
}
