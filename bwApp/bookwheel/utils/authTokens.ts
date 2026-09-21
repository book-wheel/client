import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuthTokens = { accessToken: string; refreshToken: string | null };

export const clearAuthTokens = () =>
  AsyncStorage.multiRemove(["accessToken", "refreshToken"]);

export async function saveAuthTokens(
  tokens: AuthTokens,
  onboarding = false,
) {
  try {
    if (typeof tokens?.accessToken !== "string" || !tokens.accessToken.trim()) {
      throw new Error("인증 토큰을 받지 못했습니다. 다시 로그인해주세요.");
    }
    if (!onboarding && (typeof tokens.refreshToken !== "string" || !tokens.refreshToken.trim())) {
      throw new Error("인증 토큰을 받지 못했습니다. 다시 로그인해주세요.");
    }
    // Remove the previous account's tokens before installing the new session.
    await clearAuthTokens();
    await AsyncStorage.setItem("accessToken", tokens.accessToken);
    if (!onboarding && tokens.refreshToken) {
      await AsyncStorage.setItem("refreshToken", tokens.refreshToken);
    }
  } catch (error) {
    await clearAuthTokens();
    throw error;
  }
}
