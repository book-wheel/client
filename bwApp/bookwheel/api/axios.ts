import axios, { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";

import type { ApiResponse } from "@/types/api";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 5000,
});

export const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.error?.message ?? fallbackMessage;
  }

  return error instanceof Error ? error.message : fallbackMessage;
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");

  console.log("token:", token);

  if (token) {
    config.headers?.set("Authorization", `Bearer ${token}`);
  }

  console.log("Authorization:", config.headers?.get("Authorization"));

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      console.log("401 에러 발생!");

      await AsyncStorage.removeItem("accessToken");

      Alert.alert(
        "세션 만료",
        "로그인이 만료되었습니다.\n다시 로그인해주세요.",
        [
          {
            text: "확인",
            onPress: () => router.replace("/auth/login"),
          },
        ],
      );
    }

    return Promise.reject(error);
  },
);

export default api;
