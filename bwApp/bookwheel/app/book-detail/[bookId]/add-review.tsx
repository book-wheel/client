import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

import KeyboardScrollWrapper from "@/components/addReview/KeyboardScrollWrapper";
import SimpleBookInfo from "@/components/addReview/SimpleBookInfo";
import SubmitButton from "@/components/addReview/SubmitButton";
import PhotoUpload from "@/components/completedBooks/PhotoUpload";
import ReviewInput from "@/components/completedBooks/ReviewInput";

export default function AddReview() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [review, setReview] = useState("");

  if (!bookId) return null;

  const bookData = {
    image: require("@/assets/images/book.png"),
    title: "키친은 모든 것을 말했다",
    author: "스즈키 유키",
  };

  const handleComplete = async () => {
    // 1. 유효성 검사 (리뷰 글자 수만 체크)
    if (review.length < 20) {
      Alert.alert("알림", "감상평을 최소 20자 이상 작성해 주세요.");
      return;
    }

    // 2. 서버로 보낼 가짜(Dummy) 데이터 세팅
    const mockSubmitData = {
      bookId: bookId,
      reviewText: review,
      // 사진 업로드는 아직 안 했으니 가짜 이미지 경로를 넣어줍니다.
      images: ["file://dummy/image1.jpg", "file://dummy/image2.jpg"],
    };

    try {
      // API 연동 후엔 실제 서버 통신으로 교체
      console.log("[API 요청] 서버로 데이터를 전송합니다:");
      console.log(JSON.stringify(mockSubmitData, null, 2));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. 1초 뒤 성공 알림 띄우기
      Alert.alert("등록 성공", "도서 리뷰가 성공적으로 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            // 확인 누르면 뒤로 가기
            if (router.canGoBack()) router.back();
            else router.replace(`/book-detail/${bookId}/gallery`);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("오류", "리뷰 등록에 실패했습니다.");
    }
  };

  return (
    <>
      {/* 상단 헤더 설정 */}
      <Stack.Screen
        options={{
          title: "도서 리뷰 등록",
          headerShown: true,
        }}
      />
      <KeyboardScrollWrapper>
        <View style={{ padding: 20 }}>
          <SimpleBookInfo
            image={bookData.image}
            title={bookData.title}
            author={bookData.author}
          />
          <PhotoUpload />

          <ReviewInput review={review} setReview={setReview} />
          <SubmitButton onPress={handleComplete} />
        </View>
      </KeyboardScrollWrapper>
    </>
  );
}
