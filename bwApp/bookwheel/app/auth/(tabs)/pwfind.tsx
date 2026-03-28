import { View, Text, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import React from "react";

import Input from "@/components/Input";
import Button from "@/components/Button";

import {
  sendRecoveryCode,
  verifyRecoveryPassword,
  resetPassword,
} from "@/api/auth";

export default function PwFind() {
  const [email, setEmail] = React.useState("");
  const [emailVerified, setEmailVerified] = React.useState(false);
  const [showCodeInput, setShowCodeInput] = React.useState(false);
  const [emailCode, setEmailCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordCheck, setNewPasswordCheck] = React.useState("");
  const [resetToken, setResetToken] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState("");

  //메일 인증요청 로직
  const requestEmailVerification = async () => {
    if (!email) {
      setErrorMessage("이메일을 입력하세요");
      return;
    }

    try {
      const res = await sendRecoveryCode(email);

      if (res.data.success) {
        setShowCodeInput(true);
        console.log("메일 발송 성공");
      }
    } catch (error: any) {
      console.log("비밀번호 재설정 실패:", error?.response?.data || error);
    }
  };

  // 인증번호 확인 로직
  const handleVerifyCode = async () => {
    if (!emailCode) {
      setErrorMessage("인증번호를 입력하세요");
      return;
    }
    try {
      const res = await verifyRecoveryPassword(email, emailCode);

      if (res.data.success) {
        const token = res.data?.data;

        if (!token) {
          console.log("토큰 발급 실패");
          return;
        }

        setResetToken(token);
        setEmailVerified(true);
        setShowCodeInput(false);
      }
    } catch (error: any) {
      console.log("비밀번호 재설정 실패:", error?.response?.data || error);
    }
  };

  // 비밀번호 재설정 로직
  const handleResetPassword = async () => {
    if (!resetToken) {
      console.log("토큰이 없습니다");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).+$/;

    if (!passwordRegex.test(newPassword)) {
      setErrorMessage("비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다");
      return;
    }

    if (newPassword !== newPasswordCheck) {
      setErrorMessage("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      const res = await resetPassword(resetToken, newPassword);

      if (res.data.success) {
        console.log("비밀번호 변경 성공");
        router.replace("/auth/login");
      }
    } catch (error: any) {
      console.log("비밀번호 재설정 실패:", error?.response?.data || error);
      setErrorMessage(
        error?.response?.data?.error?.message || "요청 중 오류가 발생했습니다",
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "비밀번호 찾기",
        }}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* 이메일 인증 단계 */}
        {!emailVerified ? (
          <>
            {errorMessage !== "" && (
              <Text
                style={{
                  color: "#D11A2A",
                  marginBottom: 8,
                  width: "80%",
                  fontSize: 13,
                }}
              >
                {errorMessage}
              </Text>
            )}
            {/* 인풋 박스 */}
            <Input
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage("");
              }}
              placeholder="이메일"
              keyboardType="email-address"
              rightButton={{
                label: emailVerified
                  ? "인증완료"
                  : showCodeInput
                    ? "재전송"
                    : "인증요청",
                onPress: requestEmailVerification,
                disabled: emailVerified,
              }}
            />
            {showCodeInput && (
              <Input
                value={emailCode}
                onChangeText={(text) => {
                  setEmailCode(text);
                  setErrorMessage("");
                }}
                placeholder="인증번호 입력"
                keyboardType="numeric"
                rightButton={{
                  label: "확인",
                  onPress: handleVerifyCode,
                }}
              />
            )}
          </>
        ) : (
          <>
            <Text
              style={{
                fontSize: 12,
                color: "#777",
                marginBottom: 10,
                width: "80%",
              }}
            >
              비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.
            </Text>
            {/* 새 비밀번호 입력 단계 */}
            <Input
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setErrorMessage("");
              }}
              placeholder="새 비밀번호"
              secureTextEntry
            />

            <Input
              value={newPasswordCheck}
              onChangeText={(text) => {
                setNewPasswordCheck(text);
                setErrorMessage("");
              }}
              placeholder="새 비밀번호 확인"
              secureTextEntry
            />

            {/* 버튼---------------------------------------- */}
            <Button title="저장" onPress={handleResetPassword} />
            {/* 아이디 찾기 */}
            <Button
              color="#FCF5D7"
              title="아이디 찾기"
              onPress={() => router.push("/auth/(tabs)/idfind")}
            />
          </>
        )}
      </View>
    </>
  );
}
