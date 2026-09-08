import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { router } from "expo-router";

import MemberStatusList from "@/components/group/state/MemberStatusList";
import type { MemberStatus } from "@/hooks/useGroupState";
import type {
  GroupDashboardData,
  GroupScheduleData,
} from "@/types/groupDashboard";

type CompletedGroupDashboardProps = {
  id: string | undefined;
  dashboard: GroupDashboardData;
  members: MemberStatus[];
  schedule: GroupScheduleData;
};

export default function CompletedGroupDashboard({
  id,
  dashboard,
  members,
  schedule,
}: CompletedGroupDashboardProps) {
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  const books = schedule.rounds ?? [];
  const selectedBook = books[selectedBookIndex];

  const startDate = schedule.startDate;
  const endDate = schedule.executableEndDate;

  const formatDate = (date?: string) => {
    if (!date) return "";

    const formatted = new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formatted.replace(/\.$/, "");
  };

  const getDuration = () => {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return `${diff}일 동안 함께 읽었어요`;
  };

  const handlePreviousBook = () => {
    if (selectedBookIndex === 0) return;

    setSelectedBookIndex((prev) => prev - 1);
  };

  const handleNextBook = () => {
    if (selectedBookIndex === books.length - 1) return;

    setSelectedBookIndex((prev) => prev + 1);
  };

  const handleHistoryPress = () => {
    console.log("🔥 선택한 책:", selectedBook);
    console.log("🔥 선택한 책 bookId:", selectedBook?.bookId);

    if (!id || !selectedBook) return;

    router.push({
      pathname: "/group/[id]/book-history",
      params: {
        id,
        ownBookId: selectedBook.ownBookId,
        bookTitle: selectedBook.bookTitle,
        coverImage: selectedBook.coverImage,
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 완료 안내 */}
      <View style={styles.completedHeader}>
        <Text style={styles.completedTitle}>모임이 완료되었습니다</Text>
        <Text style={styles.completedDescription}>
          함께 읽은 모든 여정을 마쳤어요.
        </Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDate(startDate)}</Text>

          <View style={styles.dateLine} />

          <Text style={styles.date}>{formatDate(endDate)}</Text>
        </View>
        <Text style={styles.duration}>{getDuration()}</Text>
      </View>

      {/* 이번 모임에서 읽은 책 */}
      <View style={styles.bookSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>이번 모임에서 읽은 책</Text>

          <Text style={styles.bookCount}>
            {selectedBookIndex + 1} / {books.length}
          </Text>
        </View>

        {selectedBook ? (
          <>
            <View style={styles.bookCarousel}>
              {/* 이전 책 */}
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={handlePreviousBook}
                disabled={selectedBookIndex === 0}
                hitSlop={12}
              >
                <Text
                  style={[
                    styles.arrow,
                    selectedBookIndex === 0 && styles.disabledArrow,
                  ]}
                >
                  ‹
                </Text>
              </TouchableOpacity>

              {/* 책 카드 */}
              <TouchableOpacity
                style={styles.bookCard}
                onPress={handleHistoryPress}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: selectedBook.coverImage }}
                  style={styles.bookCover}
                  resizeMode="cover"
                />

                <View style={styles.bookInfo}>
                  <Text style={styles.bookOwner}>
                    {selectedBook.senderNickname}님이 전달한 책
                  </Text>

                  <Text style={styles.bookTitle} numberOfLines={3}>
                    {selectedBook.bookTitle}
                  </Text>

                  <View style={styles.historyButton}>
                    <Text style={styles.historyText}>히스토리 보기</Text>

                    <Text style={styles.historyArrow}>→</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* 다음 책 */}
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={handleNextBook}
                disabled={selectedBookIndex === books.length - 1}
                hitSlop={12}
              >
                <Text
                  style={[
                    styles.arrow,
                    selectedBookIndex === books.length - 1 &&
                      styles.disabledArrow,
                  ]}
                >
                  ›
                </Text>
              </TouchableOpacity>
            </View>

            {/* 페이지 인디케이터 */}
            {books.length > 1 && (
              <View style={styles.pagination}>
                {books.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === selectedBookIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyBook}>
            <Text style={styles.emptyBookText}>
              이번 모임에서 읽은 책이 없습니다.
            </Text>
          </View>
        )}
      </View>

      {/* 멤버별 상황 */}

      <MemberStatusList id={id} members={members} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF8",
  },

  contentContainer: {
    paddingBottom: 40,
  },

  /* 완료 안내 */

  completedHeader: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 34,
  },

  completedTitle: {
    marginTop: 16,
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: -0.8,
    color: "#202020",
    textAlign: "center",
  },
  completedDescription: {
    marginTop: 9,
    fontSize: 14,
    color: "#858585",
    letterSpacing: -0.2,
  },
  dateContainer: { flexDirection: "row", alignItems: "center", marginTop: 28 },
  date: { fontSize: 13, fontWeight: "600", color: "#454545" },
  dateLine: {
    width: 18,
    height: 1,
    marginHorizontal: 9,
    backgroundColor: "#C9C7C0",
  },

  duration: {
    marginTop: 7,
    fontSize: 12,
    color: "#A58B60",
  },

  /* 책 영역 */

  bookSection: {
    paddingTop: 26,
    paddingBottom: 28,
    backgroundColor: "#FFF8E8",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 18,
  },

  sectionEyebrow: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: "#B08B52",
  },

  sectionTitle: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: "#513A11",
  },

  bookCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A58B60",
  },

  bookCarousel: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  arrowButton: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    fontSize: 32,
    fontWeight: "300",
    color: "#8B6D3A",
  },

  disabledArrow: {
    color: "#E3D7BD",
  },

  bookCard: {
    flex: 1,
    flexDirection: "row",
    minHeight: 174,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  bookCover: {
    width: 104,
    height: 142,
    borderRadius: 8,
    backgroundColor: "#F3F3F3",
  },

  bookInfo: {
    flex: 1,
    marginLeft: 15,
    paddingVertical: 2,
  },

  bookOwner: {
    fontSize: 12,
    fontWeight: "600",
    color: "#C08A3E",
  },

  bookTitle: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: "#513A11",
  },

  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: "auto",
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#E4A54E",
  },

  historyText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  historyArrow: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  paginationDot: {
    width: 5,
    height: 5,
    marginHorizontal: 3,
    borderRadius: 3,
    backgroundColor: "#E2D2B3",
  },

  paginationDotActive: {
    width: 16,
    backgroundColor: "#E4A54E",
  },

  /* 책 없음 */

  emptyBook: {
    marginHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 16,
    backgroundColor: "#FFF3D9",
  },

  emptyBookText: {
    textAlign: "center",
    fontSize: 13,
    color: "#8B6D3A",
  },

  /* 멤버 */

  memberSection: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },

  memberHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 12,
  },

  memberCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A58B60",
  },
});
