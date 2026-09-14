import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getReadingHistory } from "@/api/wheels";
import type { ReadingHistory } from "@/types/groupDashboard";

export default function MemberHistory() {
  const {
    id: rawId,
    userPK: rawUserPK,
    memberName: rawMemberName,
  } = useLocalSearchParams();

  const groupId = Array.isArray(rawId) ? rawId[0] : rawId;
  const userPK = Array.isArray(rawUserPK) ? rawUserPK[0] : rawUserPK;
  const memberName = Array.isArray(rawMemberName)
    ? rawMemberName[0]
    : rawMemberName;

  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!groupId || !userPK) return;

    const fetchHistory = async () => {
      try {
        const data = await getReadingHistory(groupId, userPK);

        console.log("독서 내역:", data);

        setHistory(data);
      } catch (error) {
        console.error("독서 내역 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [groupId, userPK]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#E4A54E" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{memberName}님의 독서 내역</Text>

        <Text style={styles.description}>
          함께 읽어온 책과 독서 기록을 확인해보세요.
        </Text>
      </View>

      {/* Empty */}
      {history.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>📚</Text>

          <Text style={styles.emptyTitle}>아직 독서 내역이 없어요</Text>

          <Text style={styles.emptyDescription}>
            책을 완독하고 인증하면{"\n"}
            이곳에 독서 기록이 남아요.
          </Text>
        </View>
      ) : (
        history.map((item) => (
          <View key={item.wheelStateId} style={styles.historyCard}>
            {/* Round */}
            <View style={styles.roundRow}>
              <View style={styles.roundBadge}>
                <Text style={styles.roundText}>ROUND {item.roundNumber}</Text>
              </View>

              <Text style={styles.dateText}>
                {new Date(item.reviewAt).toLocaleDateString("ko-KR")}
              </Text>
            </View>

            {/* Book */}
            <View style={styles.bookRow}>
              {item.coverImageUrl ? (
                <Image
                  source={{ uri: item.coverImageUrl }}
                  style={styles.bookCover}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.bookCoverPlaceholder}>
                  <Text style={styles.placeholderText}>📖</Text>
                </View>
              )}

              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.bookTitle}</Text>

                <Text style={styles.completedText}>독서 완료</Text>
              </View>
            </View>

            {/* 사진 & Review */}
            {(item.reviewText ||
              (item.authImageUrls && item.authImageUrls.length > 0)) && (
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>감상평</Text>

                {/* 사진*/}
                {item.authImageUrls && item.authImageUrls.length > 0 && (
                  <View style={styles.photoSection}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.photoList}
                    >
                      {item.authImageUrls.map((imageUrl, index) => (
                        <Image
                          key={`${item.wheelStateId}-${index}`}
                          source={{ uri: imageUrl }}
                          style={styles.authImage}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* 감상평 내용 */}
                {item.reviewText && (
                  <Text style={styles.reviewText}>{item.reviewText}</Text>
                )}
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  // =========================
  // Header
  // =========================

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 25,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.7,
    color: "#513A11",
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    color: "#A98B5A",
  },

  // =========================
  // Empty
  // =========================

  emptyBox: {
    paddingVertical: 48,
    paddingHorizontal: 24,

    alignItems: "center",

    borderRadius: 20,
    backgroundColor: "#FCF5D7",
  },

  emptyEmoji: {
    fontSize: 34,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#513A11",
  },

  emptyDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#8B7351",
  },

  // =========================
  // History Card
  // =========================

  historyCard: {
    marginBottom: 18,
    padding: 18,

    borderRadius: 20,

    backgroundColor: "#FCF5D7",
  },

  roundRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 16,
  },

  roundBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 12,

    backgroundColor: "#FFFFFF",
  },

  roundText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#E4A54E",
  },

  dateText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A98B5A",
  },

  // =========================
  // Book
  // =========================

  bookRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  bookCover: {
    width: 76,
    height: 106,

    borderRadius: 10,

    backgroundColor: "#FFFFFF",
  },

  bookCoverPlaceholder: {
    width: 76,
    height: 106,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",
  },

  placeholderText: {
    fontSize: 25,
  },

  bookInfo: {
    flex: 1,
    marginLeft: 15,
  },

  bookTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "800",
    color: "#513A11",
  },

  completedText: {
    marginTop: 10,

    fontSize: 13,
    fontWeight: "700",
    color: "#E4A54E",
  },

  // =========================
  // Auth Photos
  // =========================

  photoSection: {
    marginTop: 5,
    marginBottom: 18,
  },

  photoList: {
    gap: 10,
  },

  authImage: {
    width: 150,
    height: 150,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",
  },

  // =========================
  // Review
  // =========================

  reviewSection: {
    marginTop: 18,
    paddingTop: 18,

    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8DDBF",
  },

  reviewLabel: {
    marginBottom: 8,

    fontSize: 14,
    fontWeight: "800",
    color: "#513A11",
  },

  reviewText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    color: "#806943",
  },
});
