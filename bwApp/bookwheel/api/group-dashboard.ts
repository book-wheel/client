import axiosInstance from "@/api/axios";
import { RegisterBookRequest } from "@/types/groupDashboard";

// 그룹 대시보드 정보 조회 API
export const getDashboard = async (groupId: string) => {
  const response = await axiosInstance.get(`/groups/${groupId}/dashboard`);

  return response.data;
};

// 책 등록 API
export const registerBook = async (
  groupId: string,
  body: RegisterBookRequest,
) => {
  const response = await axiosInstance.post(`/groups/${groupId}/books`, body);

  return response.data;
};
