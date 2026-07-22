export type VoteKind = "recommend" | "not-recommend";
export type VoteType = VoteKind | null;
export type SortType = "최신순" | "인기순";

export interface ReviewItem {
  id: string;
  user: {
    name: string;
    profileUrl: string;
  };
  date: string;
  vote: VoteType;
  content: string;
  isSpoiler: boolean;
  isRevealed: boolean;
  likes: number;
  isLikedByMe: boolean;
}

export interface BookVoteStats {
  recommendPercent: number;
  notRecommendPercent: number;
}
