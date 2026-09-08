import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ReviewItem } from "./types";

const DEFAULT_PROFILE = require("@/assets/images/logo.png");

interface Props {
  review: ReviewItem;
  onToggleLike: (id: string) => void;
  onRevealSpoiler: (id: string) => void;
}

export default function ReviewCard({ review, onToggleLike, onRevealSpoiler }: Props) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfoRow}>
          <Image
            source={review.user.profileUrl.trim() ? { uri: review.user.profileUrl } : DEFAULT_PROFILE}
            style={styles.profileImage}
          />

          <View style={styles.userMeta}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.userName}>{review.user.name}</Text>
              {review.vote !== null &&
                (review.vote === "recommend" ? (
                  <View style={[styles.voteBadge, styles.recommendBadge]}>
                    <Text style={[styles.voteBadgeText, styles.recommendBadgeText]}>추천</Text>
                  </View>
                ) : (
                  <View style={[styles.voteBadge, styles.notRecommendBadge]}>
                    <Text style={[styles.voteBadgeText, styles.notRecommendBadgeText]}>비추천</Text>
                  </View>
                ))}
            </View>

            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.likeButton} onPress={() => onToggleLike(review.id)} activeOpacity={0.8}>
          <Ionicons
            name={review.isLikedByMe ? "heart" : "heart-outline"}
            size={18}
            color={review.isLikedByMe ? "#D89A3A" : "#B7A98E"}
          />
          <Text style={[styles.likeCount, review.isLikedByMe && styles.likeCountActive]}>{review.likes}</Text>
        </TouchableOpacity>
      </View>

      {review.isSpoiler && !review.isRevealed ? (
        <TouchableOpacity style={styles.spoilerCover} onPress={() => onRevealSpoiler(review.id)} activeOpacity={0.9}>
          <View style={styles.spoilerBlurBox}>
            <Text style={styles.spoilerHiddenContent}>{review.content}</Text>
            <View style={styles.spoilerFakeOverlay} />
            <View style={styles.spoilerMessageLayer}>
              <Text style={styles.spoilerMaskGuideText}>
                스포일러가 포함된 코멘트입니다.{"\n"}클릭 시 코멘트 열람이 가능합니다.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={styles.reviewContent}>{review.content}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderColor: "#F5F5F5",
    paddingBottom: 20,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: "#EEE",
  },
  userMeta: {
    justifyContent: "center",
  },
  nameBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  voteBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  voteBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  recommendBadge: {
    backgroundColor: "#F8E9B8",
  },
  recommendBadgeText: {
    color: "#A97922",
  },
  notRecommendBadge: {
    backgroundColor: "#ECEAE4",
  },
  notRecommendBadgeText: {
    color: "#9A907E",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  likeCount: {
    fontSize: 13,
    color: "#B7A98E",
    fontWeight: "500",
  },
  likeCountActive: {
    color: "#D89A3A",
  },
  reviewContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 12,
    paddingLeft: 46,
  },
  spoilerCover: {
    paddingLeft: 46,
    paddingRight: 8,
    paddingTop: 0,
    paddingBottom: 4,
  },
  spoilerBlurBox: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255, 248, 240, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(220, 205, 180, 0.55)",
  },
  spoilerHiddenContent: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B5A3A",
    opacity: 0.08,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  spoilerFakeOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(245, 240, 232, 0.82)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(220, 205, 180, 0.55)",
  },
  spoilerMessageLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  spoilerMaskGuideText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#8E7248",
    fontWeight: "700",
    textAlign: "center",
  },
});
