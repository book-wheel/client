import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { BookItem } from "./types";

type Props = {
  book: BookItem;
  width: number;
  onPressBook: () => void;
  isInterested?: boolean;
  isUpdatingInterest?: boolean;
  onToggleInterest?: () => void;
};

export default function BookTile({
  book,
  width,
  onPressBook,
  isInterested,
  isUpdatingInterest = false,
  onToggleInterest,
}: Props) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [book.image]);

  const showInterestToggle = typeof isInterested === "boolean" && onToggleInterest;

  return (
    <Pressable
      style={[styles.tile, { width }]}
      onPress={onPressBook}
    >
      <View style={[styles.imageWrap, { width }]}>
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
        {showInterestToggle && (
          <TouchableOpacity
            accessibilityLabel={isInterested ? "관심도서 해제" : "관심도서 등록"}
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
              name={isInterested ? "heart" : "heart-outline"}
              size={18}
              color={isInterested ? "#E4A54E" : "#513A11"}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {book.author}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
  },
  imageWrap: {
    height: 142,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
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
  interestButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  interestButtonDisabled: {
    opacity: 0.5,
  },
  title: {
    width: "100%",
    marginTop: 10,
    color: "#513A11",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  author: {
    width: "100%",
    marginTop: 4,
    color: "#A68D63",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
