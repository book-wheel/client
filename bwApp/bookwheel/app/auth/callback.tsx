import { logApiError } from "@/api/axios";
import { useEffect, useRef } from "react";
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
  const { code } = useLocalSearchParams<{ code?: string }>();
  const processedCodeRef = useRef<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!code) {
        console.error("OAuth code가 없습니다.");
        router.replace("/auth/login");
        return;
      }

      // 개발 모드의 effect 재실행 등으로 일회용 code가 중복 교환되는 것을 막는다.
      if (processedCodeRef.current === code) return;
      processedCodeRef.current = code;

      let stage = "load-verifier";

      try {
        // 로그인 시작할 때 저장해둔 codeVerifier 가져오기
        const codeVerifier = await SecureStore.getItemAsync(
          "oauth_code_verifier",
        );

        if (!codeVerifier) {
          throw new Error("codeVerifier가 없습니다.");
        }

        stage = "exchange-code";

        // 1회용 code를 accessToken / refreshToken으로 교환
        const res = await exchangeOAuthCode({
          code,
          codeVerifier,
        });

        stage = "validate-response";

        if (!res.data.success || !res.data.data) {
          throw new Error("OAuth token response가 올바르지 않습니다.");
        }

        const { accessToken, refreshToken, isFirstLogin } = res.data.data;

        if (!accessToken || typeof isFirstLogin !== "boolean") {
          throw new Error("OAuth token response 필드가 누락되었습니다.");
        }

        stage = "store-access-token";

        // 최초 소셜 가입자의 accessToken은 약관 동의·프로필 설정에만
        // 사용할 수 있는 온보딩 토큰이다.
        await AsyncStorage.setItem("accessToken", accessToken);

        stage = "prepare-session";

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

        stage = "clear-verifier";

        // 사용한 verifier 즉시 삭제
        await SecureStore.deleteItemAsync("oauth_code_verifier");

        Toast.show({
          type: "success",
          text1: "로그인 성공",
        });

        stage = "navigate";

        // 로그인 후 이동
        if (isFirstLogin) {
          router.replace("/auth/social-consent");
        } else {
          router.replace("/(tabs)");
        }
      } catch (error) {
        logApiError(`소셜 로그인 처리 실패 (${stage}):`, error);

        // 실패해도 verifier는 삭제
        await SecureStore.deleteItemAsync("oauth_code_verifier");
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        await clearSocialOnboarding();

        Toast.show({
          type: "error",
          text1: "오류",
          text2: __DEV__
            ? `실패 단계: ${stage}`
            : "잠시 후 다시 시도해주세요.",
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
