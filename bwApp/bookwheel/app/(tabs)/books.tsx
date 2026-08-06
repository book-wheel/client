import { getApiErrorMessage } from "@/api/axios";
import { getGalleryFeed } from "@/api/books";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import BookTile from "../../components/books/BookTile";
import BooksSectionHeader from "../../components/books/BooksSectionHeader";
import GalleryPreviewRow from "../../components/books/GalleryPreviewRow";
import ReadingBookCard from "../../components/books/ReadingBookCard";
import RecommendBookCard from "../../components/books/RecommendBookCard";
import type { BookItem, GalleryItem } from "../../components/books/types";
const bookImage = require("@/assets/images/book.png");
const galleryImage = require("@/assets/images/comment.png");

const groupName = "책바퀴 독서모임";
const interestTileWidth = 96;

const readingBooks: BookItem[] = [
  {
    id: "1",
    title: "키친은 모든 것을 말했다",
    author: "구병모",
    image: bookImage,
  },
  {
    id: "2",
    title: "모임에서 읽는 책",
    author: "책바퀴",
    image: bookImage,
  },
];

const interestBooks: BookItem[] = [
  {
    id: "1",
    title: "관심 도서 1",
    author: "책바퀴",
    image: bookImage,
  },
  {
    id: "2",
    title: "관심 도서 2",
    author: "책바퀴",
    image: bookImage,
  },
  {
    id: "3",
    title: "관심 도서 3",
    author: "책바퀴",
    image: bookImage,
  },
];

const recommendBooks: BookItem[] = [
  {
    id: "1",
    title: "키친은 모든 것을 말했다",
    author: "구병모",
    image: bookImage,
  },
  {
    id: "2",
    title: "나미야 잡화점의 기적",
    author: "히가시노 게이고",
    image: bookImage,
  },
  {
    id: "3",
    title: "시한부",
    author: "이도우",
    image: bookImage,
  },
  {
    id: "4",
    title: "막내의 재산세는 받지 되지 않는다",
    author: "책바퀴",
    image: bookImage,
  },
  {
    id: "5",
    title: "모순",
    author: "양귀자",
    image: bookImage,
  },
];

export default function Books() {
  const [galleryPreview, setGalleryPreview] = useState<GalleryItem[]>([]);
  const [galleryError, setGalleryError] = useState<string|null>(null);

  const loadGalleryPreview = useCallback(async () => {
    setGalleryError(null);

    try {
      const response = await getGalleryFeed({ size: 4 });
      const result = response.data;

      if (!result.success || !result.data) {
        setGalleryPreview([]);
        setGalleryError(result.error?.message ?? "교환독서의 순간들을 불러오지 못했습니다.",);
      return;
      }

      const items: GalleryItem[] = result.data.content.map(
        (post) => ({
          id: String(post.postId),
          isbn: post.isbn,
          image: post.thumbnailUrl ? { uri: post.thumbnailUrl } : galleryImage,
          extraCount: post.imageCount > 1 ? post.imageCount - 1 : undefined,
        }),
      );

      setGalleryPreview(items);
    } catch (error) {
        setGalleryPreview([]);
        setGalleryError(getApiErrorMessage(error,"교환독서의 순간들을 불러오지 못했습니다.",),
    );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadGalleryPreview();
    }, [loadGalleryPreview]),
  );

  const handleSearch = () => {
    router.push({
      pathname: "/search",
      params: { from: "books" },
    });
  };

  const handlePressBook = () => {
    router.push("/book-detail/1/info");
  };

  const handlePressGroup = () => {
    router.push({
      pathname: "/(tabs)/group/[id]/(top)/home",
      params: { id: "1", name: groupName },
    });
  };

  const handlePressGalleryItem = (item: GalleryItem) => {
    router.push({
      pathname: "/book-detail/[isbn]/[postId]/post",
      params: {
        isbn: item.isbn,
        postId: item.id,
      },
    });
  };

  return (
    <>
      <Tabs.Screen
        options={{
          title: "책 조회",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              accessibilityLabel="도서 검색"
              accessibilityRole="button"
              activeOpacity={0.7}
              hitSlop={8}
              onPress={handleSearch}
              style={styles.headerSearchButton}
            >
              <Ionicons name="search-outline" size={25} color="#513A11" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BooksSectionHeader title="지금 읽는 책" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {readingBooks.map((book) => (
            <ReadingBookCard
              key={book.id}
              book={book}
              groupName={groupName}
              onPressBook={handlePressBook}
              onPressGroup={handlePressGroup}
            />
          ))}
        </ScrollView>

        <BooksSectionHeader
          title="교환독서의 순간들"
          actionText="더보기"
          onPressAction={() => router.push("/(modal)/books/all-gallery")}
        />
        {galleryError ? (
          <View style={styles.galleryMessageContainer}>
            <Text style={styles.galleryMessage}>{galleryError}</Text>
          </View>
        ) : (
          <GalleryPreviewRow
            items={galleryPreview}
            onPressItem={handlePressGalleryItem}
          />
        )}

        <BooksSectionHeader title="교환독서 추천 도서" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {recommendBooks.map((book, index) => (
            <RecommendBookCard
              key={book.id}
              book={book}
              index={index}
              total={recommendBooks.length}
              onPressBook={handlePressBook}
            />
          ))}
        </ScrollView>

        <BooksSectionHeader
          title="관심 도서"
          actionText="더보기"
          onPressAction={() => router.push("/(modal)/books/all-interest")}
        />
        <View style={styles.interestList}>
          {interestBooks.map((book) => (
            <BookTile
              key={book.id}
              book={book}
              width={interestTileWidth}
              onPressBook={handlePressBook}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 48,
  },
  headerSearchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalList: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 20,
  },
  interestList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  galleryMessageContainer: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryMessage: {
    color: "#A68D63",
    fontSize: 14,
    textAlign: "center",
  },
});
