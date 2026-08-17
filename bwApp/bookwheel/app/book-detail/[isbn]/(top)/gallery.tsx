import { getApiErrorMessage } from "@/api/axios";
import { getPostGallery } from "@/api/books";
import GalleryImageGrid from "@/components/books/GalleryImageGrid";
import type { GalleryItem } from "@/components/books/types";
import { Colors } from "@/constants/theme";
import { useBookDetail } from "@/contexts/book-detail";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import type { CursorParams } from "@/types/api";
import type { PostGalleryContent } from "@/types/posts";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Gallery() {
  const { isbn } = useBookDetail();

  const fetchGalleryPage = useCallback(
    async (params: CursorParams) => {
      if (!isbn) return null;

      const response = await getPostGallery(isbn, params);
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message ?? "갤러리를 불러오지 못했습니다.",
        );
      }

      console.log("갤러리 목록:", result.data.content);
      return result.data;
    },
    [isbn],
  );

  const {
    items: galleryPosts,
    isLoading,
    error,
    loadInitial,
    loadMore,
    reset,
  } = useCursorPagination<PostGalleryContent>({
    fetchPage: fetchGalleryPage,
    pageSize: 20,
  });

  useFocusEffect(
    useCallback(() => {
      if (!isbn) return;

      reset();
      void loadInitial();
    }, [isbn, loadInitial, reset]),
  );

  useEffect(() => {
    if (!error) return;

    console.error(
      "갤러리 조회 실패:",
      getApiErrorMessage(error, "갤러리 조회를 실패하였습니다."),
    );
  }, [error]);

  const galleryItems = useMemo<GalleryItem[]>(
    () =>
      galleryPosts.map((post) => ({
        id: String(post.postId),
        isbn: post.isbn,
        image: post.thumbnailUrl ? { uri: post.thumbnailUrl } : undefined,
        extraCount:
          post.imageCount > 1 ? post.imageCount - 1 : undefined,
      })),
    [galleryPosts],
  );

  const handleAddPhoto = () => {
    if (!isbn) {
      Alert.alert("알림", "ISBN을 찾을 수 없습니다.");
      return;
    }

    router.push({
      pathname: "/book-detail/[isbn]/add-review",
      params: { isbn },
    });
  };

  const handlePressGalleryItem = (postId: string) => {
    router.push({
      pathname: "../[postId]/post",
      params: {
        isbn,
        postId,
      },
    });
  };

  return (
    <View style={styles.container}>
      <GalleryImageGrid
        items={galleryItems}
        isLoading={isLoading}
        onEndReached={() => void loadMore()}
        onPressItem={(item) => handlePressGalleryItem(item.id)}
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={handleAddPhoto}
      >
        <Feather name="plus" size={32} color="#E4A54E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCF5D7",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 5,
  },
});
