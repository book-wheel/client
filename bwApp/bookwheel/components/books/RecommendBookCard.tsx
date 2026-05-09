import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { BookItem } from "./types";

const cardWidth = 312;

type Props = {
  book: BookItem;
  index: number;
  total: number;
  onPressBook: () => void;
};

export default function RecommendBookCard({
  book,
  index,
  total,
  onPressBook,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPressBook}>
      <Image source={book.image} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.likeBadge}>
          <Text style={styles.likeBadgeText}>12명이 좋아해요</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author}>저자 : {book.author}</Text>
        <View style={styles.reviewBubble}>
          <Text style={styles.reviewName}>윤희님 후기</Text>
          <Text style={styles.reviewText} numberOfLines={2}>
            이거 크톡으로 돌리면 반응 미쳤을 듯. 이거 읽고 말 안 나옴;;
          </Text>
        </View>
      </View>
      <Ionicons name="heart-outline" size={20} color="#513A11" />
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>
          {index + 1}/{total}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    minHeight: 250,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 8,
    backgroundColor: "#FFFCF3",
    padding: 14,
    position: "relative",
  },
  image: {
    width: 104,
    height: 154,
    borderRadius: 10,
    resizeMode: "contain",
  },
  info: {
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
  title: {
    color: "#513A11",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },
  author: {
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
  indexBadge: {
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
  indexText: {
    color: "#513A11",
    fontSize: 12,
    fontWeight: "800",
  },
});
