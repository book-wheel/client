import { getApiErrorMessage } from "@/api/axios";
import { View, Text, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import React from "react";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { sendRecoveryCode, verifyRecoveryId } from "@/api/auth";

export default function IdFind() {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailVerified, setEmailVerified] = React.useState(false);
  const [showCodeInput, setShowCodeInput] = React.useState(false);
  const [emailCode, setEmailCode] = React.useState("");
  const [loginId, setLoginId] = React.useState<string>("");

  //메일 인증요청 로직
  const requestEmailVerification = async () => {
    if (!email) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    setErrorMessage("");
    try {
      const res = await sendRecoveryCode(email);

      if (res.data.success) {
        setShowCodeInput(true);
        console.log("메일 발송 성공");
      } else {
        setErrorMessage(res.data.error?.message || "아이디 찾기에 실패했습니다.");
      }
    } catch (error: any) {
      setErrorMessage(getApiErrorMessage(error, "아이디 찾기에 실패했습니다. 다시 시도해주세요."));
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailCode) {
      setErrorMessage("인증번호를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    try {
      const res = await verifyRecoveryId(email, emailCode);

      const loginId = res.data?.data?.loginId;

      if (loginId) {
        setLoginId(loginId);
        setEmailVerified(true);
        setShowCodeInput(false);
      } else {
        setErrorMessage(res.data.error?.message || "아이디 찾기에 실패했습니다.");
      }
    } catch (error: any) {
      setErrorMessage(getApiErrorMessage(error, "아이디 찾기에 실패했습니다. 다시 시도해주세요."));
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "아이디 찾기",
        }}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {errorMessage ? <Text accessibilityRole="alert">{errorMessage}</Text> : null}
        {/* 이메일 인증 단계 */}
        {!emailVerified ? (
          <>
            <Input
              value={email}
              onChangeText={setEmail}
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
                onChangeText={setEmailCode}
                placeholder="인증번호 입력"
                keyboardType="numeric"
                rightButton={{
                  label: "확인",
                  onPress: handleVerifyEmail,
                }}
              />
            )}
          </>
        ) : (
          <>
            <View
              style={{
                marginBottom: 50,
                width: "80%",
                padding: 30,
                borderRadius: 16,
                backgroundColor: "#FCF7F1",
                borderColor: "#513A11",
                borderWidth: 1,
              }}
            >
              <Text style={{ fontSize: 16, color: "#513A11" }}>
                회원님의 아이디는{" "}
                <Text style={{ fontWeight: "bold" }}>{loginId}</Text>
              </Text>
            </View>

            {/* 로그인으로 */}
            <Button
              title="로그인"
              onPress={() => router.replace("/auth/login")}
            />
            {/* 비번찾기 */}
            <Button
              color="#FCF5D7"
              title="비밀번호 찾기"
              onPress={() => router.push("/auth/(tabs)/pwfind")}
            />
          </>
        )}
      </View>
    </>
  );
}
