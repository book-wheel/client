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
