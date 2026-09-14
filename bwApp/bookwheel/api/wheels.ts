import axiosInstance from "@/api/axios";
import type {
  BookHistoryResponse,
  ReadingHistoryResponse,
} from "@/types/groupDashboard";

export type CompleteWheelStateRequest = {
  objectKeys: string[];
  reviewText: string;
};

// 완독 인증 API
export const completeWheelState = async (
  wheelStateId: string,
  body: CompleteWheelStateRequest,
) => {
  const response = await axiosInstance.patch(
    `/wheels/${wheelStateId}/complete`,
    body,
  );

  return response.data.data;
};

// 독서 이력 조회 API
export const getReadingHistory = async (
  groupId: string,
  targetUserPk: string,
) => {
  const response = await axiosInstance.get<ReadingHistoryResponse>(
    `/wheels/${groupId}/history/${targetUserPk}`,
  );

  return response.data.data;
};

// 책 별 히스토리 API
export const getBookHistory = async (groupId: string, ownBookId: string) => {
  const response = await axiosInstance.get<BookHistoryResponse>(
    `/wheels/${groupId}/history/books/${ownBookId}`,
  );

  return response.data.data;
};
