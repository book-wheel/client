import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { exchangeOAuthCode } from "@/api/auth";

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

        // 토큰 저장
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);

        // 사용한 verifier 즉시 삭제
        await SecureStore.deleteItemAsync("oauth_code_verifier");

        // 로그인 후 이동
        if (isFirstLogin) {
          router.replace("/auth/profile");
        } else {
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.error("소셜 로그인 처리 실패:", error);

        // 실패해도 verifier는 삭제
        await SecureStore.deleteItemAsync("oauth_code_verifier");

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
