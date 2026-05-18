import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

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

const galleryPreview: GalleryItem[] = [
  { id: "1", image: galleryImage },
  { id: "2", image: galleryImage },
  { id: "3", image: galleryImage },
  { id: "4", image: galleryImage },
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

  const handlePressGalleryItem = () => {
    router.push("/book-detail/1/2/post");
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
        <GalleryPreviewRow
          items={galleryPreview}
          onPressItem={handlePressGalleryItem}
        />

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
});
