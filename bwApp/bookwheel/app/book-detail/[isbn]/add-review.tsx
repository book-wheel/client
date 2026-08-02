import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking, TouchableOpacity, View } from "react-native";

import { getBookDetail } from "@/api/books";
import { uploadImageToS3 } from "@/api/images";
import { getPostImagePresignedUrls, savePost } from "@/api/posts";
import KeyboardScrollWrapper from "@/components/addReview/KeyboardScrollWrapper";
import SimpleBookInfo from "@/components/addReview/SimpleBookInfo";
import SubmitButton from "@/components/addReview/SubmitButton";
import PhotoUpload from "@/components/completedBooks/PhotoUpload";
import ReviewInput from "@/components/completedBooks/ReviewInput";
import type { BookDetailContent } from "@/types/books";

const MAX_IMAGE_COUNT = 5;

export default function AddReview() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const [review, setReview] = useState("");

  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [book, setBook] = useState<BookDetailContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  useEffect(() => {
    if (!isbn) return;

    let isActive = true;

    const fetchBookDetail = async () => {
      try {
        const response = await getBookDetail(isbn);
        const result = response.data;

        if (!result.success || !result.data) {
          throw new Error(
            result.error?.message ??
              "도서 정보를 불러오지 못했습니다.",
          );
        }

        if (isActive) {
          setBook(result.data);
        }
      } catch (error) {
        if (!isActive) return;

        Alert.alert(
          "오류",
          error instanceof Error
            ? error.message
            : "도서 정보를 불러오지 못했습니다.",
        );
      }
    };

    void fetchBookDetail();

    return () => {
      isActive = false;
    };
  }, [isbn]);

  if (!isbn) return null;

  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(); // 사진 접근 권한 요청

    if (!permission.granted) {
      Alert.alert(
        "알림",
        permission.canAskAgain
          ? "사진을 선택하려면 접근 권한이 필요합니다."
          : "휴대폰 설정에서 사진 접근 권한을 허용해 주세요.",
        [
          { text: "취소", style: "cancel" },
          permission.canAskAgain
            ? {
                text: "다시 요청",
                onPress: () => void handlePickImages(),
              }
            : {
                text: "설정 열기",
                onPress: () => void Linking.openSettings(),
              },
        ],
      );
      return;
    }

    const remainingCount = MAX_IMAGE_COUNT - images.length;

    if (remainingCount <= 0) {
      Alert.alert("알림", "사진은 최대 5장까지 선택할 수 있습니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // 이미지만 표시
      allowsMultipleSelection: true, // 여러 장 선택 허용
      selectionLimit: remainingCount, // 추가로 선택 가능한 개수
      quality: 0.8, // 품질 원본의 80%로 낮추기
    });

    if (result.canceled) return;

    // 기존 이미지에 새로운 이미지 추가하기 (5장을 넘어도 처음 5장만 저장)
    setImages((current) =>
      [...current, ...result.assets].slice(0, MAX_IMAGE_COUNT),
    );
  };

  // 사진 삭제
  const handleRemoveImage = (uri: string) => {
    setImages((current) =>
      current.filter((image) => image.uri !== uri),
    );
  };

  const handleComplete = async () => {
    if (submitLockRef.current) return;

    if (review.trim().length < 20) {
      Alert.alert("알림", "감상평을 최소 20자 이상 작성해 주세요.");
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

      const fileExtensions = images.map((image, index) => {
        const extension = (
          image.fileName?.split(".").pop() ??
          image.mimeType?.split("/").pop() ??
          ""
        ).toLowerCase();

        if (!allowedExtensions.includes(extension)) {
          throw new Error(
            `${index + 1}번째 이미지는 지원하지 않는 형식입니다.\n` +
              "jpg, jpeg, png, webp 이미지만 업로드할 수 있습니다.",
          );
        }

        return extension;
      });

      const presignedResponse = await getPostImagePresignedUrls(isbn, {
        fileExtensions,
      });

      const presignedResult = presignedResponse.data;

      if (!presignedResult.success || !presignedResult.data) {
        throw new Error(
          presignedResult.error?.message ??
            "업로드 주소 발급에 실패했습니다.",
        );
      }

      const uploadInfos = presignedResult.data.presignedUrls;

      if (uploadInfos.length !== images.length) {
        throw new Error("이미지 업로드 정보가 올바르지 않습니다.");
      }

      await Promise.all(
        uploadInfos.map((info, index) =>
          uploadImageToS3(
            info.presignedUrl,
            images[index].uri,
            images[index].mimeType ?? "image/jpeg",
          ),
        ),
      );

      const objectKeys = uploadInfos.map((info) => info.objectKey);

      const saveResponse = await savePost({
        isbn,
        content: review.trim(),
        objectKeys,
      });

      const saveResult = saveResponse.data;

      if (!saveResult.success || !saveResult.data) {
        throw new Error(
          saveResult.error?.message ?? "게시글 등록에 실패했습니다.",
        );
      }

      Alert.alert("등록 성공", "게시글이 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            // 확인 누르면 뒤로 가기
            if (router.canGoBack()) router.back();
            else router.replace(`/book-detail/${isbn}/gallery`);
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "오류",
        error instanceof Error
          ? error.message
          : "게시글 등록에 실패했습니다.",
      );
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(`/book-detail/${isbn}/gallery`);
  };

  return (
    <>
      {/* 상단 헤더 설정 */}
      <Stack.Screen
        options={{
          title: "도서 리뷰 등록",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              accessibilityLabel="뒤로가기"
              accessibilityRole="button"
              activeOpacity={0.7}
              hitSlop={10}
              onPress={handleGoBack}
            >
              <Ionicons name="chevron-back" size={28} color="#513A11" />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardScrollWrapper>
        <View style={{ padding: 20 }}>
          <SimpleBookInfo
            image={book?.cover ? { uri: book.cover } : null}
            title={book?.title ?? "도서 정보"}
            author={book?.author ?? "저자 정보 없음"}
          />
          <PhotoUpload
            images={images}
            onAddPress={handlePickImages}
            onRemove={handleRemoveImage}
          />

          <ReviewInput review={review} setReview={setReview} />
          <SubmitButton
            isSubmitting={isSubmitting}
            onPress={handleComplete}
          />
        </View>
      </KeyboardScrollWrapper>
    </>
  );
}
