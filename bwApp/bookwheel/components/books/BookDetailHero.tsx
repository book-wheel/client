import { Ionicons } from "@expo/vector-icons";
import type { ImageSourcePropType } from "react-native";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  author: string;
  pageCount: string;
  cover: ImageSourcePropType;
  isInterested: boolean;
  isInterestLoading: boolean;
  onToggleInterest: () => void;
}

export default function BookDetailHero({
  title,
  author,
  pageCount,
  cover,
  isInterested,
  isInterestLoading,
  onToggleInterest,
}: Props) {
  return (
    <View style={styles.topSection}>
      <View style={styles.visualSection}>
        <View style={styles.bookImageWrap}>
          <Image source={cover} style={styles.bookImage} resizeMode="cover" />
          <TouchableOpacity
            accessibilityLabel={isInterested ? "관심도서 해제" : "관심도서 등록"}
            accessibilityRole="button"
            accessibilityState={{
              disabled: isInterestLoading,
              busy: isInterestLoading,
            }}
            activeOpacity={0.75}
            onPress={onToggleInterest}
            style={[styles.interestButton, isInterestLoading && styles.interestButtonDisabled, ]}
          >
            {isInterestLoading ? (
              <ActivityIndicator size="small" color="#513A11" />
             ) : (
            <Ionicons
              name={isInterested ? "heart" : "heart-outline"}
              size={24}
              color={isInterested ? "#E4A54E" : "#513A11"}
            />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBadge}>
          <Text style={styles.bookTitle}>&lt; {title} &gt;</Text>
          <View style={styles.subInfoRow}>
            
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>{pageCount}</Text>
            </View>
            <View style={styles.smallBadge}>
              <Text
                style={[styles.smallBadgeText, styles.authorText]}
                numberOfLines={1}
              >
                {author}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: "#FFF",
    paddingBottom: 10,
    zIndex: 10,
  },
  visualSection: {
    alignItems: "center",
    marginTop: 10,
  },
  bookImageWrap: {
    position: "relative",
  },
  bookImage: {
    width: 130,
    height: 185,
    borderRadius: 6,
    elevation: 5,
  },
  interestButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },
  infoBadge: {
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  smallBadge: {
    backgroundColor: "#F3F0EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  smallBadgeText: {
    fontSize: 12,
    color: "#7A6F5C",
    fontWeight: "600",
  },
  authorText: {
    maxWidth: 100,
  },
  interestButtonDisabled: {
  opacity: 0.6,
  },
});
