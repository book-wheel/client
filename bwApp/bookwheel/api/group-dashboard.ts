import axiosInstance from "@/api/axios";

// 그룹 대시보드 정보 조회 API
export const getDashboard = async (groupId: string) => {
  const response = await axiosInstance.get(`/groups/${groupId}/dashboard`);

  return response.data;
};
