import { common } from "@/styles/common";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Books() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 검색 */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/search",
            params: { from: "books" },
          })
        }
      >
        <Text style={[common.button, { marginTop: 20 }]}>검색</Text>
      </TouchableOpacity>

      {/* 지금 읽는 책 */}
      <Text>지금 읽는 책</Text>
      <TouchableOpacity onPress={() => router.push("/book-detail/1/info")}>
        <Text style={[common.button, { marginTop: 20 }]}>지금읽는 책1</Text>
      </TouchableOpacity>

      {/* 갤러리 */}
      <Text>갤러리</Text>
      <TouchableOpacity
        onPress={() => router.push("/(modal)/books/all-gallery")}
      >
        <Text style={[common.button, { marginTop: 20 }]}>전체보기</Text>
      </TouchableOpacity>
    </View>
  );
}
