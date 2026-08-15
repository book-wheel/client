import { getApiErrorMessage } from "@/api/axios";
import { getGalleryFeed } from "@/api/books";
import GalleryImageGrid from "@/components/books/GalleryImageGrid";
import type { GalleryItem } from "@/components/books/types";
import { Colors } from "@/constants/theme";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import type { CursorParams } from "@/types/api";
import type { PostGalleryContent } from "@/types/posts";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AllGallery() {
  const fetchGalleryPage = useCallback(
    async (params: CursorParams) => {
      const response = await getGalleryFeed(params);
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message ??
            "교환독서의 순간들을 불러오지 못했습니다.",
        );
      }

      return result.data;
    },
    [],
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
    pageSize: 18,
  });

  useFocusEffect(
    useCallback(() => {
      reset();
      void loadInitial();
    }, [loadInitial, reset]),
  );

  const galleryItems = useMemo<GalleryItem[]>(
    () =>
      galleryPosts.map((post) => ({
        id: String(post.postId),
        isbn: post.isbn,
        image: post.thumbnailUrl
          ? { uri: post.thumbnailUrl }
          : undefined,
        extraCount:
          post.imageCount > 1
            ? post.imageCount - 1
            : undefined,
      })),
    [galleryPosts],
  );

  const handlePressItem = (item: GalleryItem) => {
    router.push({
      pathname: "/book-detail/[isbn]/[postId]/post",
      params: {
        isbn: item.isbn,
        postId: item.id,
      },
    });
  };

  const errorMessage = error
    ? getApiErrorMessage(
        error,
        "교환독서의 순간들을 불러오지 못했습니다.",
      )
    : null;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "교환독서의 순간들",
          headerShown: true,
        }}
      />

      {errorMessage && galleryItems.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{errorMessage}</Text>
        </View>
      ) : !isLoading && galleryItems.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>아직 등록된 사진이 없습니다.</Text>
        </View>
      ) : (
        <GalleryImageGrid
          items={galleryItems}
          isLoading={isLoading}
          onEndReached={() => void loadMore()}
          onPressItem={handlePressItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  message: {
    color: "#A68D63",
    fontSize: 14,
    textAlign: "center",
  },
});