import axios from "./axios";
import type { ApiResponse } from "@/types/api";
import type { MyGroupApiResponse } from "@/types/group";

//그룹 만들기
export const makingGroup = async (data: {
  groupName: string;
  groupComment: string;
  groupRule: string;

  groupPublic: boolean;
  groupPassword?: string;

  groupOffline: boolean;
  groupRegion: string | null;

  readingPeriod: number;
  startDate: string;

  maxMembers: number;
}) => {
  const response = await axios.post(`/groups/making`, data);

  return response.data;
};

type GetGroupsParams = {
  state?: "RECRUITING" | "IN_PROGRESS" | "COMPLETE";
  type?: "ONLINE" | "OFFLINE";
  region?:
    | "SEOUL"
    | "GYEONGGI"
    | "INCHEON"
    | "GANGWON"
    | "CHUNG_BUK"
    | "CHUNG_NAM"
    | "DAEJEON"
    | "SEJONG"
    | "JEON_BUK"
    | "JEON_NAM"
    | "GWANGJU"
    | "GYEONG_BUK"
    | "GYEONG_NAM"
    | "DAEGU"
    | "ULSAN"
    | "BUSAN"
    | "JEJU";

  keyword?: string;

  page?: number;
  size?: number;
};

//그룹 리스트 가져오기
export const getGroups = async ({
  state,
  type,
  region,
  keyword,
  page = 0,
  size = 10,
}: GetGroupsParams) => {
  const response = await axios.get(`/groups`, {
    params: {
      state,
      type,
      region,
      keyword,
      page,
      size,
      sort: "startDate,DESC",
    },
  });

  return response.data;
};

//그룹 가입
export const joinGroup = async (
  groupId: string,
  data: {
    password?: string;
    joinMent?: string;
  },
) => {
  const response = await axios.post(`/groups/${groupId}/join`, data);

  return response.data;
};

//내 모임 조회
export const getMyGroups = async () => {
  const response = await axios.get<ApiResponse<MyGroupApiResponse[]>>(
    "/groups/my",
  );

  return response.data.data ?? [];
};

// 그룹 멤버 조회
export const getGroupMembers = async (groupId: string) => {
  const response = await axios.get(`/groups/${groupId}/members`);

  return response.data.data;
};

// 가입 요청 목록 조회
export const getGroupRequests = async (groupId: string) => {
  const response = await axios.get(`/groups/${groupId}/members/requests`);

  return response.data.data;
};

// 가입 요청 승인/거절
export const updateMemberStatus = async (
  groupId: string,
  memberId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const response = await axios.patch(
    `/groups/${groupId}/members/${memberId}/status`,
    {
      status,
    },
  );

  return response.data.data;
};

// 그룹 상세 조회
export const getGroupDetail = async (groupId: string) => {
  const response = await axios.get(`/groups/${groupId}`);

  return response.data.data;
};

// 읽기 순서 지정
export type MemberOrder = {
  order: number;
  memberId: string;
  nickname: string;
  profileImage: string;
};

export const updateMemberOrder = async (
  groupId: string,
  data: {
    isRandom: boolean;
    memberIds?: string[];
  },
) => {
  const response = await axios.post(`/groups/${groupId}/members/order`, data);

  return response.data.data as MemberOrder[];
};
