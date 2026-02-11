import { router, useLocalSearchParams } from "expo-router";
import { common } from "@/styles/common";
import { View, Text, TouchableOpacity } from "react-native";

export default function Gallery() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

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
    </View>
  );
}
