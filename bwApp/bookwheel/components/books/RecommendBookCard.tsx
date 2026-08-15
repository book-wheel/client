import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { RecommendBookItem } from "./types";

type Props = {
  book: RecommendBookItem;
  onPressBook: () => void;
  onToggleInterest: () => void;
  isUpdatingInterest?: boolean;
};

export default function RecommendBookCard({
  book,
  onPressBook,
  onToggleInterest,
  isUpdatingInterest = false,
}: Props) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [book.image]);

  return (
    <Pressable style={styles.card} onPress={onPressBook}>
      {book.image && !hasImageError ? (
        <Image
          source={book.image}
          style={styles.image}
          onError={() => setHasImageError(true)}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>책 이미지가 없습니다</Text>
        </View>
      )}
      <View style={styles.info}>
        <View style={styles.likeBadge}>
          <Text style={styles.likeBadgeText}>
            {book.likeCount}명이 좋아해요
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author}>저자 : {book.author}</Text>
        <View style={styles.reviewBubble}>
          {book.review ? (
            <>
              <Text style={styles.reviewName}>
                {book.review.reviewerName}님 후기
              </Text>
              <Text style={styles.reviewText} numberOfLines={2}>
                {book.review.comment}
              </Text>
            </>
          ) : (
            <Text style={styles.emptyReviewText}>
              아직 공개된 후기가 없어요.
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        accessibilityLabel={
          book.isInterested ? "관심도서 해제" : "관심도서 등록"
        }
        accessibilityRole="button"
        accessibilityState={{ disabled: isUpdatingInterest, busy: isUpdatingInterest }}
        activeOpacity={0.75}
        disabled={isUpdatingInterest}
        onPress={(event) => {
          event.stopPropagation();
          onToggleInterest();
        }}
        style={[styles.interestButton, isUpdatingInterest && styles.interestButtonDisabled]}
      >
        <Ionicons
          name={book.isInterested ? "heart" : "heart-outline"}
          size={20}
          color={book.isInterested ? "#E4A54E" : "#513A11"}
        />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
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
  imagePlaceholder: {
    width: 104,
    height: 154,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 8,
  },
  imagePlaceholderText: {
    color: "#777",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
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
  emptyReviewText: {
    color: "#A68D63",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  interestButton: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCF5D7",
  },
  interestButtonDisabled: {
    opacity: 0.5,
  },
});
