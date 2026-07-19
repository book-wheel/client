import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import BookInfo from "@/components/completedBooks/BookInfo";
import PhotoUpload from "@/components/completedBooks/PhotoUpload";
import ReviewInput from "@/components/completedBooks/ReviewInput";
import CompleteButton from "@/components/completedBooks/CompleteButton";
import { useCompletedBooks } from "@/hooks/useCompletedBooks";

export default function CompletedBooks() {
  const { id: rawId, memberId: rawMemberId } = useLocalSearchParams();

  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const memberId = Array.isArray(rawMemberId) ? rawMemberId[0] : rawMemberId;

  const { review, setReview, handleComplete } = useCompletedBooks(
    id ?? "",
    memberId ?? "",
  );

  // params 없으면 렌더 안함
  if (!id || !memberId) return null;

  const book = {
    image: require("@/assets/images/book.png"),
    title: "키친은 모든 것을 말했다",
    author: "스즈키 유키",
    owner: "김주옥",
    publisher: "○○출판사",
    publishDate: "2025년 1월 25일",
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ padding: 20 }}>
        <BookInfo {...book} />
        <PhotoUpload />
        <ReviewInput review={review} setReview={setReview} />
        <CompleteButton onPress={handleComplete} />
      </View>
    </ScrollView>
  );
}
