import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as Linking from "expo-linking";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SocialButton from "@/components/Button/SocialButton";
import AuthCard from "@/components/card";

import { login } from "@/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/api/axios";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 로그인 시 기존 토큰 제거
  useEffect(() => {
    const clearToken = async () => {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    };

    clearToken();
  }, []);

  const handleLogin = async () => {
    if (loading) return;

    if (!userId || !password) {
      console.log("아이디/비밀번호 입력 필요");
      return;
    }

    try {
      setLoading(true);

      const res = await login({
        loginId: userId,
        password,
      });

      if (!res.data.success) {
        setErrorMessage(
          res.data.error?.message || "아이디 또는 비밀번호가 올바르지 않습니다",
        );
        setLoading(false);
        return;
      }

      const { accessToken, refreshToken, isProfileSet } = res.data.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      if (isProfileSet) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth/profile");
      }
    } catch (error: any) {
      const message = "아이디 또는 비밀번호가 올바르지 않습니다";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // 소셜 로그인 핸들러
  const handleSocialLogin = (provider: "google" | "kakao") => {
    const url = `http://43.200.65.32:8080/api/v1/auth/authorize/${provider}`;
    Linking.openURL(url);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7EDE0",
      }}
    >
      <AuthCard>
        <Text
          style={{
            fontSize: 30,
            marginBottom: 40,
            color: "#513A11",
          }}
        >
          로그인
        </Text>
        {/* 인풋박스 */}
        <Input
          value={userId}
          onChangeText={setUserId}
          placeholder="아이디"
          keyboardType="default"
        />
        <Input
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
          placeholder="비밀번호"
          secureTextEntry
        />

        {errorMessage !== "" && (
          <Text
            style={{
              color: "#E4A54E",
              fontSize: 13,
              width: "80%",
              marginBottom: 20,
            }}
          >
            {errorMessage}
          </Text>
        )}
        {/* 아이디/비번 찾기 */}
        <TouchableOpacity
          style={{
            marginBottom: 26,
            borderBottomWidth: 1,
            borderBottomColor: "#E4A54E",
            paddingBottom: 2,
          }}
          onPress={() => router.push("/auth/(tabs)/idfind")}
        >
          <Text
            style={{
              color: "#E4A54E",
              fontSize: 12,
            }}
          >
            아이디 / 비밀번호 찾기
          </Text>
        </TouchableOpacity>
        {/* 회원가입/로그인 버튼 */}
        <Button title="로그인" onPress={handleLogin} />
        <Button
          title="회원가입"
          onPress={() => router.push("/auth/signup")}
          color="#FCF5D7"
        />
        {/* 소셜로그인 */}
        <View style={styles.socialRow}>
          <SocialButton
            type="google"
            onPress={() => handleSocialLogin("google")}
          />
          <SocialButton
            type="kakao"
            onPress={() => handleSocialLogin("kakao")}
          />
        </View>
      </AuthCard>
    </View>
  );
}

// 소셜로그인 정렬 스타일
const styles = StyleSheet.create({
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 70,
    marginTop: 20,
  },
});
