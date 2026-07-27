import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReviewCard from "./ReviewCard";
import type { ReviewItem, SortType } from "./types";

interface Props {
  reviews: ReviewItem[];
  sortType: SortType;
  isSortDropdownOpen: boolean;
  totalReviewCount: number;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  onToggleSortDropdown: () => void;
  onSelectSort: (sortType: SortType) => void;
  onToggleLike: (id: string) => void;
  onRevealSpoiler: (id: string) => void;
  onLoadMore: () => void;
}

export default function ReviewList({
  reviews,
  sortType,
  isSortDropdownOpen,
  totalReviewCount,
  hasNextPage,
  isLoadingMore,
  onToggleSortDropdown,
  onSelectSort,
  onToggleLike,
  onRevealSpoiler,
  onLoadMore,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.listHeader}>
        <Text style={styles.reviewCountTitle}>리뷰 {totalReviewCount}</Text>

        <View style={styles.sortDropdownWrap}>
          <TouchableOpacity style={styles.sortButton} onPress={onToggleSortDropdown} activeOpacity={0.8}>
            <Text style={styles.sortText}>{sortType}</Text>
            <Ionicons name={isSortDropdownOpen ? "chevron-up" : "chevron-down"} size={14} color="#555" />
          </TouchableOpacity>

          {isSortDropdownOpen && (
            <View style={styles.sortDropdownMenu}>
              <SortDropdownItem isSelected={sortType === "최신순"} onPress={() => onSelectSort("최신순")}>
                최신순
              </SortDropdownItem>
              <SortDropdownItem isSelected={sortType === "인기순"} onPress={() => onSelectSort("인기순")}>
                인기순
              </SortDropdownItem>
            </View>
          )}
        </View>
      </View>

      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onToggleLike={onToggleLike}
          onRevealSpoiler={onRevealSpoiler}
        />
      ))}

      {hasNextPage && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          disabled={isLoadingMore}
          onPress={onLoadMore}
          activeOpacity={0.8}
        >
          <Text style={styles.loadMoreText}>
            {isLoadingMore ? "불러오는 중..." : "더보기"}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#777" />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface SortDropdownItemProps {
  children: string;
  isSelected: boolean;
  onPress: () => void;
}

function SortDropdownItem({ children, isSelected, onPress }: SortDropdownItemProps) {
  return (
    <TouchableOpacity style={styles.sortDropdownItem} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.sortDropdownItemText, isSelected && styles.sortDropdownItemTextActive]}>{children}</Text>
      {isSelected && <Ionicons name="checkmark" size={14} color="#D89A3A" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    paddingBottom: 40,
    overflow: "visible",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    zIndex: 100,
    elevation: 100,
  },
  reviewCountTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  sortDropdownWrap: {
    position: "relative",
    zIndex: 200,
    elevation: 200,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  sortText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  sortDropdownMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    minWidth: 96,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#DCC9A5",
    borderRadius: 14,
    paddingVertical: 6,
    zIndex: 300,
    elevation: 300,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  sortDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sortDropdownItemText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  sortDropdownItemTextActive: {
    color: "#D89A3A",
    fontWeight: "700",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    gap: 4,
    marginTop: 10,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
  },
});
