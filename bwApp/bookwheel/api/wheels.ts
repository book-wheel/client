import axiosInstance from "@/api/axios";

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
