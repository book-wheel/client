export interface MyStep {
  wheelStateId: string;
  bookId: string;
  status: string;
  bookTitle: string;
  coverImage: string;
  senderNickname: string;
}

export interface MyBookStep {
  bookId: string;
  bookTitle: string;
  holderNickname: string;
  status: string;
  location: string;
  coverImage: string;
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

export interface GroupDashboardResponse {
  success: boolean;
  data: GroupDashboardData;
}

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

export interface CreateScheduleRequest {
  startDate: string;
  endDate?: string;
  excludedDates: string[];
  excludedDateRanges: ExcludedDateRange[];
}

export interface RoundSchedule {
  roundNumber: number;
  startDate: string;
  endDate?: string;
}
