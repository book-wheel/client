import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { common } from "@/styles/common";

export default function AllGallery() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>갤러리</Text>

      {/* 책 게시물로 이동 */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/book-detail/[bookId]/[galleryId]/post",
            params: {
              bookId: "1",
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
