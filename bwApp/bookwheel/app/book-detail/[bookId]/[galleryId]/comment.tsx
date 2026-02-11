import { useLocalSearchParams, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Comment() {
  const { bookId, galleryId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>
        {bookId}책 {galleryId} 게시물 댓글
      </Text>
    </View>
  );
}
