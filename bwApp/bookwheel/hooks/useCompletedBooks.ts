import { showApiError } from "@/api/axios";
import { useState } from "react";
import { router } from "expo-router";
import type { ImagePickerAsset } from "expo-image-picker";
import Toast from "react-native-toast-message";

import { completeWheelState } from "@/api/wheels";
import { getImageFileInfo, uploadImage } from "@/api/images";

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
        images.map((image, index) => {
          const { fileName, mimeType } = getImageFileInfo(
            image.fileName,
            image.mimeType,
            `review-${Date.now()}-${index}`,
          );

          return uploadImage(image.uri, fileName, "reviews", mimeType);
        }),
      );

      // 2. 완독 인증 API 호출
      await completeWheelState(wheelStateId, {
        objectKeys,
        reviewText: review,
      });
      Toast.show({
        type: "success",
        text1: "완독 인증이 완료되었어요!",
      });

      // 3. 완료 후 원래 그룹 상태 화면으로 이동
      router.replace({
        pathname: "/group/[id]/state",
        params: {
          id: groupId,
        },
      });
    } catch (error: any) {
      showApiError(error, "완독 인증에 실패했습니다. 다시 시도해주세요.");
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
