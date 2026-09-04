import { getApiErrorMessage } from "@/api/axios";
import {
  getExchangeRecommendation,
  getGalleryFeed,
  getInterestedBooks,
  toggleBookLike,
} from "@/api/books";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import BookTile from "../../components/books/BookTile";
import BooksSectionHeader from "../../components/books/BooksSectionHeader";
import GalleryPreviewRow from "../../components/books/GalleryPreviewRow";
import RecommendBookCard from "../../components/books/RecommendBookCard";
import type { BookItem, GalleryItem, RecommendBookItem } from "../../components/books/types";
const galleryImage = require("@/assets/images/comment.png");

const interestColumns = 3;
const interestMaxTileWidth = 96;
const interestGap = 20;
const contentHorizontalPadding = 20;

type SectionStatusProps = {
  isLoading?: boolean;
  message: string;
};

function SectionStatus({ isLoading = false, message }: SectionStatusProps) {
  return (
    <View style={styles.sectionStatus}>
      {isLoading ? (
        <ActivityIndicator color="#E4A54E" />
      ) : (
        <Text style={styles.sectionStatusText}>{message}</Text>
      )}
    </View>
  );
}

export default function Books() {
  const { width } = useWindowDimensions();
  const interestTileWidth = Math.min(
    interestMaxTileWidth,
    (width - contentHorizontalPadding * 2 - interestGap * (interestColumns - 1)) /
      interestColumns,
  );
  const [galleryPreview, setGalleryPreview] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string|null>(null);
  const [interestBooks, setInterestBooks] = useState<BookItem[]>([]);
  const [interestLoading, setInterestLoading] = useState(false);
  const [interestError, setInterestError] = useState<string | null>(null);
  const [recommendation, setRecommendation] =
    useState<RecommendBookItem | null>(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] =
    useState<string | null>(null);
  const [isUpdatingRecommendation, setIsUpdatingRecommendation] =
    useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadGalleryPreview = useCallback(async () => {
    setGalleryLoading(true);
    setGalleryError(null);

    try {
      const response = await getGalleryFeed({ size: 4 });
      const result = response.data;

      if (!result.success || !result.data) {
        setGalleryPreview([]);
        setGalleryError(result.error?.message ?? "교환독서의 순간들을 불러오지 못했습니다.",);
return;
      }

      const items: GalleryItem[] = result.data.content.map(
        (post) => ({
          id: String(post.postId),
          isbn: post.isbn,
          image: post.thumbnailUrl ? { uri: post.thumbnailUrl } : galleryImage,
          extraCount: post.imageCount > 1 ? post.imageCount - 1 : undefined,
        }),
      );

      setGalleryPreview(items);
    } catch (error) {
        setGalleryPreview([]);
        setGalleryError(getApiErrorMessage(error,"교환독서의 순간들을 불러오지 못했습니다.",),
    );
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  const loadInterestPreview = useCallback(async () => {
    setInterestLoading(true);
    setInterestError(null);

    try {
      const response = await getInterestedBooks({ size: 3 });
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message ?? "관심 도서를 불러오지 못했습니다.",
        );
      }

      setInterestBooks(
        result.data.content.map((book) => ({
          id: String(book.bookInfoId),
          isbn: book.isbn,
          title: book.title ?? "제목 없음",
          author: book.author ?? "저자 미상",
          image: book.coverImageUrl
            ? { uri: book.coverImageUrl }
            : undefined,
        })),
      );
    } catch (error) {
      setInterestBooks([]);
      setInterestError(
        getApiErrorMessage(error, "관심 도서를 불러오지 못했습니다."),
      );
    } finally {
      setInterestLoading(false);
    }
  }, []);

  const loadRecommendation = useCallback(async () => {
    setRecommendationLoading(true);
    setRecommendationError(null);

    try {
      const response = await getExchangeRecommendation();
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message ?? "추천 도서를 불러오지 못했습니다.",
        );
      }

      const book = result.data.book;

      setRecommendation(
        book
          ? {
              isbn: book.isbn,
              title: book.title,
              author: book.author,
              image: book.coverImageUrl
                ? { uri: book.coverImageUrl }
                : undefined,
              likeCount: book.likeCount,
              isInterested: book.isInterested,
              review: book.review
                ? {
                    reviewerName: book.review.reviewerName,
                    comment: book.review.comment,
                  }
                : null,
            }
          : null,
      );
    } catch (error) {
      setRecommendation(null);
      setRecommendationError(
        getApiErrorMessage(error, "추천 도서를 불러오지 못했습니다."),
      );
    } finally {
      setRecommendationLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadGalleryPreview();
      void loadInterestPreview();
      void loadRecommendation();
    }, [loadGalleryPreview, loadInterestPreview, loadRecommendation]),
  );

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await Promise.all([
        loadGalleryPreview(),
        loadInterestPreview(),
        loadRecommendation(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    isRefreshing,
    loadGalleryPreview,
    loadInterestPreview,
    loadRecommendation,
  ]);

  const handleSearch = () => {
    router.push({
      pathname: "/search",
      params: { from: "books" },
    });
  };

  const handlePressBook = (isbn: string) => {
    router.push({
      pathname: "/book-detail/[isbn]/info",
      params: { isbn },
    });
  };

  const handlePressGalleryItem = (item: GalleryItem) => {
    router.push({
      pathname: "/book-detail/[isbn]/[postId]/post",
      params: {
        isbn: item.isbn,
        postId: item.id,
      },
    });
  };

  const handleToggleRecommendation = async () => {
    if (!recommendation || isUpdatingRecommendation) return;

    setIsUpdatingRecommendation(true);
    setRecommendationError(null);

    try {
      const response = await toggleBookLike(recommendation.isbn);
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message ?? "관심 도서를 변경하지 못했습니다.",
        );
      }

      const liked = result.data.liked;

      setRecommendation((current) =>
        current
          ? {
              ...current,
              isInterested: liked,
              likeCount: Math.max(
                0,
                current.likeCount + (liked ? 1 : -1),
              ),
            }
          : current,
      );

      await loadInterestPreview();
    } catch (error) {
      setRecommendationError(
        getApiErrorMessage(error, "관심 도서를 변경하지 못했습니다."),
      );
    } finally {
      setIsUpdatingRecommendation(false);
    }
  };

  return (
    <>
      <Tabs.Screen
        options={{
          title: "책 조회",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              accessibilityLabel="도서 검색"
              accessibilityRole="button"
              activeOpacity={0.7}
              hitSlop={8}
              onPress={handleSearch}
              style={styles.headerSearchButton}
            >
              <Ionicons name="search-outline" size={25} color="#513A11" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void handleRefresh()}
            colors={["#E4A54E"]}
            tintColor="#E4A54E"
          />
        }
      >
        <BooksSectionHeader
          title="교환독서의 순간들"
          actionText="더보기"
          onPressAction={() => router.push("/(modal)/books/all-gallery")}
        />
        {galleryLoading && galleryPreview.length === 0 ? (
          <SectionStatus isLoading message="갤러리를 불러오는 중입니다." />
        ) : galleryError ? (
          <SectionStatus message={galleryError} />
        ) : galleryPreview.length === 0 ? (
          <SectionStatus message="아직 등록된 사진이 없습니다." />
        ) : (
          <GalleryPreviewRow
            items={galleryPreview}
            onPressItem={handlePressGalleryItem}
          />
        )}

        <BooksSectionHeader title="오늘의 교환독서 추천 도서" />
        {recommendationLoading && !recommendation ? (
          <SectionStatus isLoading message="추천 도서를 불러오는 중입니다." />
        ) : recommendation ? (
          <>
            <RecommendBookCard
              book={recommendation}
              isUpdatingInterest={isUpdatingRecommendation}
              onPressBook={() => handlePressBook(recommendation.isbn)}
              onToggleInterest={() => void handleToggleRecommendation()}
            />
            {recommendationError ? (
              <Text style={styles.actionError}>{recommendationError}</Text>
            ) : null}
          </>
        ) : (
          <SectionStatus
            message={
              recommendationError ?? "오늘의 추천 도서가 없습니다."
            }
          />
        )}

        <BooksSectionHeader
          title="관심 도서"
          actionText="더보기"
          onPressAction={() => router.push("/(modal)/books/all-interest")}
        />
        {interestLoading && interestBooks.length === 0 ? (
          <SectionStatus isLoading message="관심 도서를 불러오는 중입니다." />
        ) : interestError ? (
          <SectionStatus message={interestError} />
        ) : interestBooks.length === 0 ? (
          <SectionStatus message="아직 관심 도서가 없습니다." />
        ) : (
          <View style={styles.interestList}>
            {interestBooks.map((book) => (
              <BookTile
                key={book.id}
                book={book}
                width={interestTileWidth}
                onPressBook={() => {
                  if (book.isbn) handlePressBook(book.isbn);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: contentHorizontalPadding,
    paddingTop: 18,
    paddingBottom: 48,
  },
  headerSearchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  interestList: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: interestGap,
  },
  sectionStatus: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  sectionStatusText: {
    color: "#A68D63",
    fontSize: 14,
    textAlign: "center",
  },
  actionError: {
    marginTop: 8,
    color: "#B84A4A",
    fontSize: 12,
    textAlign: "center",
  },
});
