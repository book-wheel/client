export type ReadingStatus = "READY" | "READING" | "COMPLETED";

export type CurrentRoundAssignment = {
  wheelStateId: string;
  bookId: string;
  bookTitle: string;
  coverImage: string;
  readingStatus: ReadingStatus;
};

export type GroupMember = {
  memberId: string;
  userPK: string;
  nickname: string;
  profileImageUrl: string;
  role: "LEADER" | "VICE" | "MEMBER";
  readOrder: number;

  // 현재 라운드의 독서 정보
  currentRoundAssignment: CurrentRoundAssignment | null;
};

export type GroupMembersData = {
  totalCount: number;

  // 현재 진행 중인 라운드
  currentRound: {
    roundId: string;
    roundNumber: number;
  } | null;

  members: GroupMember[];
};
