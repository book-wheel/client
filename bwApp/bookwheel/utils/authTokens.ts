import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthTokens } from "@/api/auth";

export const clearAuthTokens = () =>
  AsyncStorage.multiRemove(["accessToken", "refreshToken"]);

export const saveAuthTokens = async ({ accessToken, refreshToken }: AuthTokens) => {
  if (!accessToken) throw new Error("인증 토큰이 없습니다.");

  try {
    // 새 계정의 토큰을 저장하기 전에 이전 Refresh Token을 제거한다.
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem("refreshToken", refreshToken);
    }
  } catch (error) {
    await clearAuthTokens();
    throw error;
  }
};
