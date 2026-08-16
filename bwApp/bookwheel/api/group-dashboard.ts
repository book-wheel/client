import axiosInstance from "@/api/axios";
import {
  CreateScheduleRequest,
  RegisterBookRequest,
} from "@/types/groupDashboard";

// 그룹 대시보드 정보 조회 API
export const getDashboard = async (groupId: string) => {
  const response = await axiosInstance.get(`/groups/${groupId}/dashboard`);

  return response.data.data;
};

// 책 등록 API
export const registerBook = async (
  groupId: string,
  body: RegisterBookRequest,
) => {
  const response = await axiosInstance.post(`/groups/${groupId}/books`, body);

  return response.data;
};

// 책 재등록 API
export type UpdateOwnBookRequest = {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  coverImage: string;
  totalPage: number;
  bookCondition: string;
  noteToReader: string;
};

export const updateOwnBook = async (
  groupId: string,
  ownBookId: string,
  data: UpdateOwnBookRequest,
) => {
  const response = await axiosInstance.patch(
    `/groups/${groupId}/books/${ownBookId}`,
    data,
  );

  return response.data.data;
};

// 일정 생성 API
export const createSchedule = async (
  groupId: string,
  body: CreateScheduleRequest,
) => {
  const response = await axiosInstance.post(
    `/groups/${groupId}/schedule`,
    body,
  );

  return response.data.data;
};

// 그룹 일정 조회 API
export const getGroupSchedule = async (groupId: string) => {
  const response = await axiosInstance.get(`/groups/${groupId}/schedule`);

  return response.data.data;
};

// 그룹 일정 수정 API
export type CreateFutureScheduleRequest = {
  totalRoundCount: number;
  readingPeriod: number;
  endDate: string;
  excludedDates: string[];
  excludedDateRanges: {
    startDate: string;
    endDate: string;
  }[];
};

export const createFutureSchedule = async (
  groupId: string,
  data: CreateFutureScheduleRequest,
) => {
  const response = await axiosInstance.post(
    `/groups/${groupId}/schedule/future`,
    data,
  );

  return response.data.data;
};
