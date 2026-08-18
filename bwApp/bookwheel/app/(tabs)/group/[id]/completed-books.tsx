import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";

import BookInfo from "@/components/completedBooks/BookInfo";
import PhotoUpload from "@/components/completedBooks/PhotoUpload";
import ReviewInput from "@/components/completedBooks/ReviewInput";
import CompleteButton from "@/components/completedBooks/CompleteButton";
import { useCompletedBooks } from "@/hooks/useCompletedBooks";

export default function CompletedBooks() {
  const {
    id: rawId,
    wheelStateId: rawWheelStateId,
    bookId: rawBookId,
    bookTitle: rawBookTitle,
    coverImage: rawCoverImage,
    senderNickname: rawSenderNickname,
  } = useLocalSearchParams();

  const groupId = Array.isArray(rawId) ? rawId[0] : rawId;

  const wheelStateId = Array.isArray(rawWheelStateId)
    ? rawWheelStateId[0]
    : rawWheelStateId;

  const bookId = Array.isArray(rawBookId) ? rawBookId[0] : rawBookId;
  const bookTitle = Array.isArray(rawBookTitle)
    ? rawBookTitle[0]
    : rawBookTitle;
  const coverImage = Array.isArray(rawCoverImage)
    ? rawCoverImage[0]
    : rawCoverImage;
  const senderNickname = Array.isArray(rawSenderNickname)
    ? rawSenderNickname[0]
    : rawSenderNickname;

  const {
    review,
    setReview,
    images,
    addImages,
    removeImage,
    handleComplete,
    isCompleting,
  } = useCompletedBooks(groupId ?? "", wheelStateId ?? "");

  const book = {
    image: coverImage,
    title: bookTitle,
    author: "",
    owner: senderNickname,
  };

  console.log("완독 화면 책 정보:", {
    bookId,
    bookTitle,
    coverImage,
    senderNickname,
  });

  const handleAddImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 1,
    });

    if (result.canceled) return;

    addImages(result.assets);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ padding: 20 }}>
        <BookInfo {...book} />
        <PhotoUpload
          images={images}
          onAddPress={handleAddImages}
          onRemove={removeImage}
        />
        <ReviewInput review={review} setReview={setReview} />
        <CompleteButton onPress={handleComplete} />
      </View>
    </ScrollView>
  );
}
