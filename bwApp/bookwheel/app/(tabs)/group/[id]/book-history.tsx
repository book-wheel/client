import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { getBookHistory } from "@/api/wheels";
import type { BookHistoryData } from "@/types/groupDashboard";

export default function BookHistory() {
  const { id, ownBookId } = useLocalSearchParams<{
    id: string;
    ownBookId: string;
    bookTitle?: string;
    coverImage?: string;
  }>();

  const [history, setHistory] = useState<BookHistoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !ownBookId) return;

    const fetchHistory = async () => {
      try {
        const data = await getBookHistory(id, ownBookId);

        console.log("📚 책 히스토리 응답:", JSON.stringify(data, null, 2));

        console.log(
          "📸 인증 이미지:",
          data?.histories?.map((item) => ({
            readerName: item.readerName,
            authImageUrls: item.authImageUrls,
          })),
        );

        setHistory(data);
      } catch (error) {
        console.error("책 히스토리 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id, ownBookId]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#E4A54E" />
      </View>
    );
  }

  if (!history) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>히스토리를 불러올 수 없어요.</Text>

        <Text style={styles.emptyDescription}>잠시 후 다시 시도해주세요.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 책 정보 */}
      <View style={styles.bookSection}>
        <Image
          source={{ uri: history.coverImageUrl }}
          style={styles.bookCover}
          resizeMode="cover"
        />

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={3}>
            {history.bookTitle}
          </Text>

          <Text style={styles.author}>{history.author}</Text>
        </View>
      </View>

      {/* 히스토리 안내 */}
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>함께 읽은 기록</Text>

        <Text style={styles.historyCount}>
          {history.histories.length}개의 기록
        </Text>
      </View>

      {/* 히스토리 */}
      {history.histories.length === 0 ? (
        <View style={styles.emptyHistory}>
          <Text style={styles.emptyHistoryText}>
            아직 남겨진 기록이 없어요.
          </Text>
        </View>
      ) : (
        <View style={styles.historyList}>
          {history.histories.map((item) => (
            <View key={item.wheelStateId} style={styles.historyCard}>
              {/* 멤버 + 날짜 */}
              <View style={styles.historyTop}>
                <View style={styles.profileCircle}>
                  <Text style={styles.profileText}>
                    {item.readerName.charAt(0)}
                  </Text>
                </View>

                <View style={styles.readerInfo}>
                  <Text style={styles.readerName}>{item.readerName}</Text>

                  <Text style={styles.completedDate}>
                    {formatDate(item.completedAt)}
                  </Text>
                </View>
              </View>

              {/* 리뷰 */}
              {!!item.reviewText && (
                <Text style={styles.reviewText}>{item.reviewText}</Text>
              )}

              {/* 인증 이미지 */}
              {item.authImageUrls.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imageList}
                >
                  {item.authImageUrls.map((imageUrl, index) => (
                    <Image
                      key={`${item.wheelStateId}-${index}`}
                      source={{ uri: imageUrl }}
                      style={styles.authImage}
                      onLoad={() =>
                        console.log("✅ 인증 이미지 로드 성공:", imageUrl)
                      }
                      onError={(e) =>
                        console.log(
                          "❌ 인증 이미지 로드 실패:",
                          imageUrl,
                          e.nativeEvent,
                        )
                      }
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
        </View>
      )}
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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDF8",
  },

  /* Header */

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    fontSize: 32,
    fontWeight: "300",
    color: "#513A11",
    lineHeight: 32,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#513A11",
  },

  headerSpacer: {
    width: 32,
  },

  /* Book */

  bookSection: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#FFF8E8",
  },

  bookCover: {
    width: 92,
    height: 130,
    borderRadius: 8,
    backgroundColor: "#F3F3F3",
  },

  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },

  bookTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#513A11",
  },

  author: {
    marginTop: 8,
    fontSize: 13,
    color: "#8B6D3A",
  },

  /* History header */

  historyHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 14,
  },

  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#513A11",
  },

  historyCount: {
    fontSize: 12,
    color: "#A58B60",
  },

  /* History */

  historyList: {
    marginHorizontal: 20,
  },

  historyCard: {
    marginBottom: 12,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F4EBD8",
  },

  historyTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileCircle: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "#FFF0D0",
  },

  profileText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#A46E25",
  },

  readerInfo: {
    marginLeft: 10,
  },

  readerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#513A11",
  },

  completedDate: {
    marginTop: 3,
    fontSize: 11,
    color: "#A58B60",
  },

  reviewText: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 22,
    color: "#5F513D",
  },

  imageList: {
    marginTop: 14,
  },

  authImage: {
    width: 110,
    height: 110,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
  },

  /* Empty */

  emptyHistory: {
    marginHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#FFF8E8",
  },

  emptyHistoryText: {
    fontSize: 13,
    color: "#8B6D3A",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDF8",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#513A11",
  },

  emptyDescription: {
    marginTop: 8,
    fontSize: 13,
    color: "#8B6D3A",
  },
});
