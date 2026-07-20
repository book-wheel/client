import ReviewComposer from "@/components/review/ReviewComposer";
import ReviewList from "@/components/review/ReviewList";
import ReviewVoteSection from "@/components/review/ReviewVoteSection";
import type { ReviewItem, SortType, VoteKind, VoteType } from "@/components/review/types";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { mockReviewItems, mockReviewVoteStats } from "@/mocks/books/review";

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

function parseReviewDate(date: string) {
  return new Date(date.replace(/\./g, "-")).getTime();
}

export default function Review() {
  const [myVote, setMyVote] = useState<VoteType>(null);
  const [inputText, setInputText] = useState("");
  const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>(mockReviewItems);
  const [sortType, setSortType] = useState<SortType>("최신순");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [visibleReviewCount, setVisibleReviewCount] = useState(INITIAL_VISIBLE_REVIEW_COUNT);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortType === "인기순" && b.likes !== a.likes) {
        return b.likes - a.likes;
      }

      return parseReviewDate(b.date) - parseReviewDate(a.date);
    });
  }, [reviews, sortType]);

  const handleVote = (vote: VoteKind) => {
    setMyVote((currentVote) => (currentVote === vote ? null : vote));
  };

  const handleSelectSort = (nextSort: SortType) => {
    setSortType(nextSort);
    setVisibleReviewCount(INITIAL_VISIBLE_REVIEW_COUNT);
    setIsSortDropdownOpen(false);
  };

  const toggleLike = (id: string) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === id
          ? {
              ...review,
              isLikedByMe: !review.isLikedByMe,
              likes: review.isLikedByMe ? review.likes - 1 : review.likes + 1,
            }
          : review,
      ),
    );
  };

  const revealSpoiler = (id: string) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) => (review.id === id ? { ...review, isRevealed: true } : review)),
    );
  };

  const handleSubmitComment = () => {
    const trimmedText = inputText.trim();

    if (!trimmedText) {
      return;
    }

    if (myVote === null) {
      Alert.alert("알림", "추천 또는 비추천을 선택해주세요.");
      return;
    }

    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join(".");
    const newReview: ReviewItem = {
      id: Date.now().toString(),
      user: {
        name: "나",
        profileUrl: "",
      },
      date,
      vote: myVote,
      content: trimmedText,
      isSpoiler: isSpoilerChecked,
      isRevealed: !isSpoilerChecked,
      likes: 0,
      isLikedByMe: false,
    };

    setReviews((currentReviews) => [newReview, ...currentReviews]);
    setVisibleReviewCount((currentCount) => Math.max(currentCount, INITIAL_VISIBLE_REVIEW_COUNT));
    setInputText("");
    setIsSpoilerChecked(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ReviewVoteSection myVote={myVote} voteStats={mockReviewVoteStats} onVote={handleVote} />
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
