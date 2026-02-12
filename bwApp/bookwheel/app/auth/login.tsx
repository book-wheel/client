import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SocialButton from "@/components/Button/SocialButton";
import AuthCard from "@/components/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          value={email}
          onChangeText={setEmail}
          placeholder="이메일"
          keyboardType="email-address"
        />
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          secureTextEntry
        />
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
        <Button title="로그인" onPress={() => router.replace("../(tabs)")} />
        <Button
          title="회원가입"
          onPress={() => router.push("/auth/signup")}
          color="#FCF5D7"
        />
        {/* 소셜로그인 */}
        <View style={styles.socialRow}>
          <SocialButton type="google" onPress={() => {}} />
          <SocialButton type="kakao" onPress={() => {}} />
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
