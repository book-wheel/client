import { View, Text, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import React from "react";

import Input from "@/components/Input";
import Button from "@/components/Button";

export default function PwFind() {
  const [email, setEmail] = React.useState("");
  const [emailVerified, setEmailVerified] = React.useState(false);
  const [showCodeInput, setShowCodeInput] = React.useState(false);
  const [emailCode, setEmailCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordCheck, setNewPasswordCheck] = React.useState("");

  //메일 인증요청 로직
  const requestEmailVerification = () => {
    console.log("Requesting email verification for:", email);
    setShowCodeInput(true);
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
            {/* 인풋 박스 */}
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
                  onPress: () => {
                    console.log("입력한 코드:", emailCode);

                    setEmailVerified(true);
                  },
                  disabled: emailVerified,
                }}
              />
            )}
          </>
        ) : (
          <>
            {/* 새 비밀번호 입력 단계 */}
            <Input
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="새 비밀번호"
              secureTextEntry
            />
            <Input
              value={newPasswordCheck}
              onChangeText={setNewPasswordCheck}
              placeholder="새 비밀번호 확인"
              secureTextEntry
            />

            {/* 버튼---------------------------------------- */}
            <Button
              title="저장"
              onPress={() => router.replace("/auth/login")}
            />
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
