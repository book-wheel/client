import axios, { AxiosError, isAxiosError, isCancel } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";

import { clearAuthTokens } from "@/utils/authTokens";

import type { ApiResponse } from "@/types/api";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 5000,
});

const isNetworkFailure = (error: unknown) =>
  error instanceof Error && error.message === "Network request failed";

// 처리 가능한 통신 오류는 개발용 빨간 오류 화면 대신 진단 로그로 남긴다.
// 예상하지 못한 프로그램 오류는 계속 console.error로 확인할 수 있다.
export const logApiError = (context: string, error: unknown) => {
  if (isAxiosError(error) || isNetworkFailure(error)) {
    console.info(context, getApiErrorMessage(error, "요청을 처리하지 못했습니다."));
  } else {
    console.error(context, error);
  }
};

export const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isNetworkFailure(error)) {
    return "서버에 연결하지 못했습니다. 네트워크 연결을 확인해주세요.";
  }
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "요청 시간이 초과되었습니다. 다시 시도해주세요.";
    }
    if (!error.response) {
      return "서버에 연결하지 못했습니다. 네트워크 연결을 확인해주세요.";
    }
    if (error.response.status >= 500) {
      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
    if (error.response.data?.error?.code === "GROUP_011") {
      return "모임 가입이 승인된 회원만 이용할 수 있습니다. 가입 상태를 확인해주세요.";
    }
    const message = error.response.data?.error?.message;
    return typeof message === "string" && message.trim()
      ? message.trim()
      : fallbackMessage;
  }

  return error instanceof Error && error.message.trim()
    ? error.message
    : fallbackMessage;
};

const sessionErrors = new WeakSet<object>();
let expiredAuthorization: unknown;

export const showApiError = (error: unknown, fallbackMessage: string) => {
  if (
    isCancel(error) ||
    (typeof error === "object" && error !== null && sessionErrors.has(error))
  ) return;
  Alert.alert("오류", getApiErrorMessage(error, fallbackMessage), [{ text: "확인" }]);
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");

  if (token) {
    config.headers?.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    // HTTP 200이어도 API가 실패를 반환하면 화면의 catch에서 처리한다.
    if (response.data?.success === false) {
      throw new AxiosError(
        "API request failed",
        "ERR_BAD_RESPONSE",
        response.config,
        response.request,
        response,
      );
    }
    return response;
  },

  async (error) => {
    const url = error.config?.url ?? "";
    const isPublicRequest =
      url.startsWith("/auth/") || url.startsWith("/users/recovery/");
    const authorization = error.config?.headers?.get("Authorization");
    if (error.response?.status === 401 && !isPublicRequest && authorization) {
      sessionErrors.add(error);
      if (expiredAuthorization !== authorization) {
        expiredAuthorization = authorization;
        try {
          await clearAuthTokens();
        } catch (storageError) {
          console.error("인증 정보 삭제 실패:", storageError);
        }
        Alert.alert(
          "오류",
          "로그인이 만료되었습니다.\n다시 로그인해주세요.",
          [{ text: "확인", onPress: () => router.replace("/auth/login") }],
          { cancelable: false },
        );
      }
    }

    return Promise.reject(error);
  },
);

export default api;
