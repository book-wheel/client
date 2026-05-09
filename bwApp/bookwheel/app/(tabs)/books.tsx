import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const bookImage = require("@/assets/images/book.png");
const galleryImage = require("@/assets/images/comment.png");
const groupName = "책바퀴 독서모임";
const interestTileWidth = 96;
const recommendCardWidth = 312;

type BookItem = {
  id: string;
  title: string;
  author: string;
  image: ImageSourcePropType;
};

type GalleryItem = {
  id: string;
  image: ImageSourcePropType;
};

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

  return (
    <>
      <Tabs.Screen
        options={{
          title: "책 조회",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSearch}
              activeOpacity={0.7}
              style={styles.headerSearchButton}
            >
              <Ionicons name="search" size={25} color="#513A11" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title="지금 읽는 책" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.readingList}
        >
          {readingBooks.map((book) => (
            <ReadingBookCard key={book.id} book={book} />
          ))}
        </ScrollView>

        <SectionTitle
          title="교환독서의 순간들"
          actionText="더보기"
          onPressAction={() => router.push("/(modal)/books/all-gallery")}
        />
        <View style={styles.galleryPreview}>
          {galleryPreview.map((item) => (
            <Pressable
              key={item.id}
              style={styles.galleryPreviewItem}
              onPress={() => router.push("/book-detail/1/2/post")}
            >
              <Image source={item.image} style={styles.galleryImage} />
            </Pressable>
          ))}
        </View>

        <SectionTitle title="교환독서 추천 도서" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendList}
        >
          {recommendBooks.map((book, index) => (
            <RecommendBookCard
              key={book.id}
              book={book}
              index={index}
              total={recommendBooks.length}
            />
          ))}
        </ScrollView>

        <SectionTitle
          title="관심 도서"
          actionText="더보기"
          onPressAction={() => router.push("/(modal)/books/all-interest")}
        />
        <View style={styles.interestList}>
          {interestBooks.map((book) => (
            <BookTile key={book.id} book={book} width={interestTileWidth} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

function SectionTitle({
  title,
  actionText,
  onPressAction,
}: {
  title: string;
  actionText?: string;
  onPressAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionText && onPressAction && (
        <TouchableOpacity onPress={onPressAction} activeOpacity={0.7}>
          <Text style={styles.moreText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ReadingBookCard({ book }: { book: BookItem }) {
  return (
    <View style={styles.readingCard}>
      <Pressable onPress={() => router.push("/book-detail/1/info")}>
        <Image source={book.image} style={styles.readingImage} />
      </Pressable>
      <TouchableOpacity
        style={styles.roomButton}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/group/[id]/(top)/home",
            params: { id: "1", name: groupName },
          })
        }
      >
        <View style={styles.roomButtonContent}>
          <Text style={styles.roomNameText}>{groupName}</Text>
          <Text style={styles.roomButtonSuffix}>으로 가기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function RecommendBookCard({
  book,
  index,
  total,
}: {
  book: BookItem;
  index: number;
  total: number;
}) {
  return (
    <Pressable
      style={styles.recommendCard}
      onPress={() => router.push("/book-detail/1/info")}
    >
      <Image source={book.image} style={styles.recommendImage} />
      <View style={styles.recommendInfo}>
        <View style={styles.likeBadge}>
          <Text style={styles.likeBadgeText}>12명이 좋아해요</Text>
        </View>
        <Text style={styles.recommendTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.recommendAuthor}>저자 : {book.author}</Text>
        <View style={styles.reviewBubble}>
          <Text style={styles.reviewName}>윤희님 후기</Text>
          <Text style={styles.reviewText} numberOfLines={2}>
            이거 크톡으로 돌리면 반응 미쳤을 듯. 이거 읽고 말 안 나옴;;
          </Text>
        </View>
      </View>
      <Ionicons name="heart-outline" size={20} color="#513A11" />
      <View style={styles.recommendIndexBadge}>
        <Text style={styles.recommendIndexText}>
          {index + 1}/{total}
        </Text>
      </View>
    </Pressable>
  );
}

function BookTile({ book, width }: { book: BookItem; width: number }) {
  return (
    <Pressable
      style={[styles.bookTile, { width }]}
      onPress={() => router.push("/book-detail/1/info")}
    >
      <Image source={book.image} style={styles.bookTileImage} />
      <Text style={styles.bookTileTitle} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.bookTileAuthor} numberOfLines={1}>
        {book.author}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 48,
  },
  headerSearchButton: {
    marginRight: 20,
    padding: 6,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#513A11",
    fontSize: 24,
    fontWeight: "800",
  },
  moreText: {
    color: "#A68D63",
    fontSize: 15,
    fontWeight: "600",
  },
  readingList: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 20,
  },
  readingCard: {
    width: 184,
    minHeight: 256,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#FFFCF3",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  readingImage: {
    width: 126,
    height: 184,
    borderRadius: 10,
    resizeMode: "cover",
  },
  roomButton: {
    width: "100%",
    height: 30,
    marginTop: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCF5D7",
  },
  roomButtonContent: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 2,
  },
  roomNameText: {
    fontWeight: "900",
    color: "#513A11",
    fontSize: 13,
  },
  roomButtonSuffix: {
    color: "#7B6A4A",
    fontSize: 11,
    fontWeight: "700",
  },
  galleryPreview: {
    flexDirection: "row",
    gap: 8,
  },
  galleryPreviewItem: {
    flex: 1,
    aspectRatio: 1,
    overflow: "hidden",
    backgroundColor: "#EDEDED",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  recommendList: {
    gap: 14,
    paddingRight: 20,
  },
  recommendCard: {
    width: recommendCardWidth,
    minHeight: 250,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 8,
    backgroundColor: "#FFFCF3",
    padding: 14,
    position: "relative",
  },
  recommendImage: {
    width: 104,
    height: 154,
    borderRadius: 10,
    resizeMode: "contain",
  },
  recommendInfo: {
    flex: 1,
  },
  likeBadge: {
    alignSelf: "flex-start",
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: "#FFE6C0",
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  likeBadgeText: {
    color: "#E4A54E",
    fontSize: 12,
    fontWeight: "700",
  },
  recommendTitle: {
    color: "#513A11",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },
  recommendAuthor: {
    color: "#6E5A38",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 14,
  },
  reviewBubble: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  reviewName: {
    color: "#A68D63",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },
  reviewText: {
    color: "#513A11",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  recommendIndexBadge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    minWidth: 38,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCF5D7",
  },
  recommendIndexText: {
    color: "#513A11",
    fontSize: 12,
    fontWeight: "800",
  },
  interestList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookTile: {
    alignItems: "center",
  },
  bookTileImage: {
    width: interestTileWidth,
    height: 142,
    borderRadius: 10,
    resizeMode: "contain",
  },
  bookTileTitle: {
    width: "100%",
    marginTop: 10,
    color: "#513A11",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  bookTileAuthor: {
    width: "100%",
    marginTop: 4,
    color: "#A68D63",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
