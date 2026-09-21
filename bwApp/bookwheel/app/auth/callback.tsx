import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import { exchangeOAuthCode } from "@/api/auth";
import {
  beginSocialOnboarding,
  clearSocialOnboarding,
} from "@/utils/socialOnboarding";

export default function OAuthCallback() {
  console.log("🚨 OAuth CALLBACK 실행됨");

  const { code } = useLocalSearchParams<{ code?: string }>();

  console.log("🚨 받은 code:", code);

  useEffect(() => {
    const handleCallback = async () => {
      if (!code) {
        console.error("OAuth code가 없습니다.");
        router.replace("/auth/login");
        return;
      }

      try {
        // 로그인 시작할 때 저장해둔 codeVerifier 가져오기
        const codeVerifier = await SecureStore.getItemAsync(
          "oauth_code_verifier",
        );

        if (!codeVerifier) {
          throw new Error("codeVerifier가 없습니다.");
        }

        console.log("🔑 code:", code);
        console.log("🔐 codeVerifier:", codeVerifier);

        // 1회용 code를 accessToken / refreshToken으로 교환
        const res = await exchangeOAuthCode({
          code,
          codeVerifier,
        });

        console.log("✅ OAuth token response:", res.data);

        const { accessToken, refreshToken, isFirstLogin } = res.data.data;

        // 최초 소셜 가입자의 accessToken은 약관 동의·프로필 설정에만
        // 사용할 수 있는 온보딩 토큰이다.
        await AsyncStorage.setItem("accessToken", accessToken);

        if (isFirstLogin) {
          await beginSocialOnboarding();
        } else {
          await clearSocialOnboarding();

          if (refreshToken) {
            await AsyncStorage.setItem("refreshToken", refreshToken);
          } else {
            await AsyncStorage.removeItem("refreshToken");
          }
        }

        // 사용한 verifier 즉시 삭제
        await SecureStore.deleteItemAsync("oauth_code_verifier");

        Toast.show({
          type: "success",
          text1: "로그인 성공",
        });

        // 로그인 후 이동
        if (isFirstLogin) {
          router.replace("/auth/social-consent");
        } else {
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.error("소셜 로그인 처리 실패:", error);

        // 실패해도 verifier는 삭제
        await SecureStore.deleteItemAsync("oauth_code_verifier");
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        await clearSocialOnboarding();

        Toast.show({
          type: "error",
          text1: "소셜 로그인 실패",
          text2: "잠시 후 다시 시도해주세요.",
        });

        router.replace("/auth/login");
      }
    };

    handleCallback();
  }, [code]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator />
    </View>
  );
}
