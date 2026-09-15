import type { ApiResponse } from "@/types/api";

export type WheelStatus =
  | "PLANNED"
  | "WAITING"
  | "READY"
  | "READING"
  | "COMPLETED"
  | "UNFINISHED";

export interface MyStep {
  wheelStateId: string | null;
  bookId: string;
  status: WheelStatus;
  bookTitle: string;
  coverImage: string | null;
  senderNickname: string | null;
}

export interface MyBookStep {
  bookId: string;
  bookTitle: string;
  coverImage: string | null;
  author: string | null;
  holderNickname: string | null;
  status: WheelStatus | null;
  location: string | null;
}

export interface GroupDashboardData {
  groupName: string;
  currentRound: number;
  totalRound: number;
  startDate: string;
  endDate: string;
  dDay: number;

  myStep: MyStep | null;
  myBookStep: MyBookStep | null;
}

export type GroupDashboardApiResponse = ApiResponse<GroupDashboardData>;

export interface RegisterBookRequest {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  coverImage: string;
  totalPage: number | null;
  bookCondition: string;
  noteToReader: string;
}

export interface ExcludedDateRange {
  startDate: string;
  endDate: string;
}

export type CreateScheduleRequest = {
  startDate: string;
  readingPeriod: number;
  endDate: string;
  excludedDates: string[];
  excludedDateRanges: {
    startDate: string;
    endDate: string;
  }[];
  targetMemberCount: number;
};

export interface RoundSchedule {
  roundNumber: number;
  startDate: string;
  endDate?: string;
}

export type GroupScheduleRound = {
  roundNumber: number;
  startDate: string;
  endDate: string;
  executable: boolean;
  wheelStateId: string;
  ownBookId: string;
  wheelStatus: string;
  bookId: string;
  bookTitle: string;
  coverImage: string;
  senderNickname: string;
};

export type GroupScheduleData = {
  startDate: string;
  readingPeriod: number;
  endDate: string;
  excludedDates: string[];
  excludedDateRanges: {
    startDate: string;
    endDate: string;
  }[];
  scheduleStatus: string;
  scheduleReconfigurationStatus: string;
  targetMemberCount: number;
  currentMemberCount: number;
  canStart: boolean;
  blockingReasons: string[];
  missingBookMembers: {
    userPK: string;
    nickname: string;
  }[];
  plannedRoundCount: number;
  executableRoundCount: number;
  plannedEndDate: string;
  executableEndDate: string;
  protectedRoundCount: number;
  minTotalRoundCount: number;
  rounds: GroupScheduleRound[];
};

export interface ReadingHistory {
  wheelStateId: string;
  bookTitle: string;
  roundNumber: number;
  authImageUrls: string[];
  reviewText: string;
  reviewAt: string;
}

export interface ReadingHistory {
  wheelStateId: string;
  ownBookId: string;
  bookTitle: string;
  coverImageUrl: string;
  roundNumber: number;
  authImageUrls: string[];
  reviewText: string;
  reviewAt: string;
}

export interface ReadingHistoryResponse {
  success: boolean;
  data: ReadingHistory[];
  error?: {
    code: string;
    message: string;
  };
}

export type BookHistory = {
  wheelStateId: string;
  roundNumber: number;
  readerName: string;
  authImageUrls: string[];
  reviewText: string;
  completedAt: string;
};

export type BookHistoryData = {
  ownBookId: string;
  bookTitle: string;
  author: string;
  coverImageUrl: string;
  histories: BookHistory[];
};

export type BookHistoryResponse = {
  success: boolean;
  data: BookHistoryData;
  error: {
    code: string;
    message: string;
  } | null;
};
