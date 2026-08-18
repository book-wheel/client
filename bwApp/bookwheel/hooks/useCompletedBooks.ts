import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import type { ImagePickerAsset } from "expo-image-picker";

import { completeWheelState } from "@/api/wheels";
import { uploadImage } from "@/api/images";

const MAX_IMAGE_COUNT = 5;

export function useCompletedBooks(groupId: string, wheelStateId: string) {
  const [review, setReview] = useState("");
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  const addImages = (newImages: ImagePickerAsset[]) => {
    setImages((prev) => {
      return [...prev, ...newImages].slice(0, MAX_IMAGE_COUNT);
    });
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((image) => image.uri !== uri));
  };

  const handleComplete = async () => {
    if (isCompleting) return;

    try {
      setIsCompleting(true);

      // 1. 사진을 S3에 업로드
      const objectKeys = await Promise.all(
        images.map((image, index) =>
          uploadImage(
            image.uri,
            image.fileName ?? `review-${Date.now()}-${index}.jpg`,
          ),
        ),
      );

      // 2. 완독 인증 API 호출
      await completeWheelState(wheelStateId, {
        objectKeys,
        reviewText: review,
      });

      // 3. 완료 후 원래 그룹 상태 화면으로 이동
      router.replace({
        pathname: "/group/[id]/state",
        params: {
          id: groupId,
        },
      });
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message ?? "완독 인증에 실패했습니다.";

      console.error("완독 인증 실패:", {
        status: error.response?.status,
        data: error.response?.data,
        message,
        url: error.config?.url,
        method: error.config?.method,
      });

      Alert.alert("완독 인증 실패", message);
    } finally {
      setIsCompleting(false);
    }
  };

  return {
    review,
    setReview,
    images,
    addImages,
    removeImage,
    handleComplete,
    isCompleting,
  };
}
