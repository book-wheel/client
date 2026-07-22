import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import {
  createBookReview,
  deleteReviewVote,
  getBookReviews,
  getReviewStats,
  toggleReviewLike,
  updateReviewVote,
} from "@/api/books";
import ReviewComposer from "@/components/review/ReviewComposer";
import ReviewList from "@/components/review/ReviewList";
import ReviewVoteSection from "@/components/review/ReviewVoteSection";
import type { BookVoteStats, ReviewItem, SortType, VoteKind, VoteType } from "@/components/review/types";
import { useBookDetail } from "@/contexts/book-detail";
import type { BookReviewContent } from "@/types/books";

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

function parseReviewDate(date: string) {
  return new Date(date.replace(/\./g, "-")).getTime();
}

function mapBookReviewToReviewItem(
  review: BookReviewContent,
): ReviewItem {
  return {
    id: String(review.reviewId),
    user: {
      name: review.reviewerName,
      profileUrl: review.profileImageUrl ?? "",
    },
  date: review.createdAt.slice(0, 10).replace(/-/g, "."),
  vote:
    review.isRecommended === null
      ? null
      : review.isRecommended
        ? "recommend"
        : "not-recommend",
  content: review.comment,
  isSpoiler: review.isHidden,
  isRevealed: !review.isHidden,
  likes: review.likeCount,
  isLikedByMe: review.isLikedByMe,
  };
}


export default function Review() {
  const { isbn } = useBookDetail();
  const [myVote, setMyVote] = useState<VoteType>(null);
  const [inputText, setInputText] = useState("");
  const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [sortType, setSortType] = useState<SortType>("최신순");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [voteStats, setVoteStats] = useState<BookVoteStats>({
    recommendPercent: 0,
    notRecommendPercent: 0,
  });
  const [visibleReviewCount, setVisibleReviewCount] = useState(INITIAL_VISIBLE_REVIEW_COUNT);

  useEffect(() => {
    if (!isbn) return;

    const fetchReviewStats = async () => {
      try {
        const response = await getReviewStats(isbn);
        const result = response.data;

        if (!result.success || !result.data) {
          throw new Error(result.error?.message ?? "추천 통계를 불러오지 못했습니다.");
        }

        const stats = result.data;

        setVoteStats({
          recommendPercent: stats.recommendedRatio,
          notRecommendPercent: stats.notRecommendedRatio,
        });

        if (stats.myVote === "RECOMMEND") {
          setMyVote("recommend");
        } else if (stats.myVote === "NOT_RECOMMEND") {
          setMyVote("not-recommend");
        } else {
          setMyVote(null);
        }
      } catch (fetchError) {
        console.error("추천 통계 조회 실패:", fetchError);
      }
    };

    void fetchReviewStats();
  }, [isbn]);

  useEffect(() => {
    if (!isbn) return;

    const fetchReviews = async () => {
      try {
        const response = await getBookReviews(
          isbn,
          {
            sort:
            sortType === "최신순"
            ? "latest"
            : "popular",
            page: 0,
            size: 10,
          }
        );

        const result = response.data;

        if (!result.success || !result.data) {
          throw new Error(result.error?.message ?? "리뷰를 불러오지 못했습니다.");
        }

        const reviewItems = result.data.content.map(mapBookReviewToReviewItem);
        console.log("리뷰 목록:", reviewItems);

        setReviews(reviewItems);
        setVisibleReviewCount(INITIAL_VISIBLE_REVIEW_COUNT);
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
      }
    };

    void fetchReviews();
  }, [isbn, sortType]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortType === "인기순" && b.likes !== a.likes) {
        return b.likes - a.likes;
      }

      return parseReviewDate(b.date) - parseReviewDate(a.date);
    });
  }, [reviews, sortType]);

  const handleVote = async (vote: VoteKind) => {
    if (!isbn) return;

    try {
      const response =
        myVote === vote
          ? await deleteReviewVote(isbn)
          : await updateReviewVote(isbn, {
              vote: vote === "recommend" ? "RECOMMEND" : "NOT_RECOMMEND",
            });
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(result.error?.message ?? "추천 상태 변경에 실패했습니다.");
      }

      setVoteStats({
        recommendPercent: result.data.recommendedRatio,
        notRecommendPercent: result.data.notRecommendedRatio,
      });

      if (result.data.myVote === "RECOMMEND") {
        setMyVote("recommend");
      } else if (result.data.myVote === "NOT_RECOMMEND") {
        setMyVote("not-recommend");
      } else {
        setMyVote(null);
      }
    } catch (error) {
      console.error("추천 상태 변경 실패:", error);
      Alert.alert("오류", "추천 상태를 변경하지 못했습니다.");
    }
  };

  const handleSelectSort = (nextSort: SortType) => {
    setSortType(nextSort);
    setVisibleReviewCount(INITIAL_VISIBLE_REVIEW_COUNT);
    setIsSortDropdownOpen(false);
  };

  const toggleLike = async (id: string) => {
    try {
      const response = await toggleReviewLike(Number(id));
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(result.error?.message ?? "리뷰 공감 변경에 실패했습니다.");
      }

      const updatedLike = result.data;

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === String(updatedLike.reviewId)
            ? {
                ...review,
                isLikedByMe: updatedLike.isLikedByMe,
                likes: updatedLike.likeCount,
              }
            : review,
        ),
      );
    } catch (error) {
      console.error("리뷰 공감 변경 실패:", error);
    }
  };

  const revealSpoiler = (id: string) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) => (review.id === id ? { ...review, isRevealed: true } : review)),
    );
  };

  const handleSubmitComment = async () => {
    const trimmedText = inputText.trim();

    if (!trimmedText) {
      Alert.alert("알림", "리뷰 내용을 입력해주세요.");
      return;
    }

    if (!isbn) {
      Alert.alert("오류", "책 정보를 불러오지 못했습니다.");
      return;
    }

    try {
      const response = await createBookReview(isbn, {
        comment: trimmedText,
        isHidden: isSpoilerChecked,
      });

    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.error?.message ?? "리뷰 등록 실패했습니다.");
    }

    const createReview = mapBookReviewToReviewItem(result.data);

    setReviews((currentReviews) => [createReview, ...currentReviews]);
    setVisibleReviewCount((currentCount) => Math.max(currentCount, INITIAL_VISIBLE_REVIEW_COUNT));
    setInputText("");
    setIsSpoilerChecked(false);

    Alert.alert("알림", "리뷰가 등록되었습니다.");
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      Alert.alert("오류", error instanceof Error ? error.message : "리뷰 등록에 실패했습니다. 다시 시도해주세요.");
    }

  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ReviewVoteSection myVote={myVote} voteStats={voteStats} onVote={handleVote} />
      <View style={styles.thickDivider} />
      <ReviewComposer
        value={inputText}
        isSpoilerChecked={isSpoilerChecked}
        onChangeText={setInputText}
        onToggleSpoiler={() => setIsSpoilerChecked((currentValue) => !currentValue)}
        onExpand={() => console.log("상세 작성 페이지로 이동")}
        onSubmit={handleSubmitComment}
      />
      <View style={styles.thickDivider} />
      <ReviewList
        reviews={sortedReviews}
        sortType={sortType}
        isSortDropdownOpen={isSortDropdownOpen}
        visibleReviewCount={visibleReviewCount}
        onToggleSortDropdown={() => setIsSortDropdownOpen((isOpen) => !isOpen)}
        onSelectSort={handleSelectSort}
        onToggleLike={toggleLike}
        onRevealSpoiler={revealSpoiler}
        onLoadMore={() => setVisibleReviewCount((currentCount) => currentCount + 10)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  thickDivider: {
    height: 4,
  },
});
