import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";

export default function Signup() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [emailCode, setEmailCode] = useState("");

  //메일 인증요청 로직
  const requestEmailVerification = () => {
    console.log("Requesting email verification for:", email);
    setShowCodeInput(true);
  };

  // const [nicknameChecked, setNicknameChecked] = useState(false);

  // // 닉네임 중복확인 로직
  // const checkNickname = () => {
  //   console.log("Checking nickname:", nickname);
  //   setNicknameChecked(true);
  // };

  const isPasswordMatch = password === passwordCheck;

  // 약관 동의 상태----------------------------
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  useEffect(() => {
    if (agreeTerms && agreePrivacy) {
      setAgreeAll(true);
    } else {
      setAgreeAll(false);
    }
  }, [agreeTerms, agreePrivacy]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "회원가입",
        }}
      />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, marginBottom: 30, color: "#513A11" }}>
          회원가입
        </Text>

        {/* 인풋박스 */}
        <Input
          value={userId}
          onChangeText={setUserId}
          placeholder="아이디"
          keyboardType="default"
        />
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
                setShowCodeInput(false);
              },
            }}
          />
        )}

        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          secureTextEntry
        />
        <Input
          value={passwordCheck}
          onChangeText={setPasswordCheck}
          placeholder="비밀번호 확인"
          secureTextEntry
        />
        {/* <Input
          value={nickname}
          onChangeText={(text) => {
            setNickname(text);
            setNicknameChecked(false); // 닉네임 바뀌면 다시
          }}
          placeholder="닉네임"
          rightButton={{
            label: nicknameChecked ? "사용가능" : "중복확인",
            onPress: checkNickname,
            disabled: nicknameChecked,
          }}
        /> */}

        {/* 약관동의------------------------ */}
        <View style={{ width: 317, marginTop: 30 }}>
          {/* 전체동의 */}
          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => {
              const next = !agreeAll;
              setAgreeAll(next);
              setAgreeTerms(next);
              setAgreePrivacy(next);
            }}
          >
            <View style={[styles.checkbox, agreeAll && styles.checked]} />
            <Text style={styles.checkText}>전체 동의</Text>
          </TouchableOpacity>

          {/* 이용약관 */}
          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => {
              setAgreeTerms(!agreeTerms);
            }}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checked]} />
            <Text style={styles.checkText}>이용약관 동의 (필수)</Text>
          </TouchableOpacity>

          {/* 개인정보 */}
          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => {
              setAgreePrivacy(!agreePrivacy);
            }}
          >
            <View style={[styles.checkbox, agreePrivacy && styles.checked]} />
            <Text style={styles.checkText}>개인정보 처리방침 동의 (필수)</Text>
          </TouchableOpacity>
        </View>

        {/* 회원가입------------------------ */}
        <View style={{ marginTop: 10 }} />
        <Button
          title="회원가입"
          onPress={() => router.replace("/auth/profile")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    marginRight: 8,
  },

  checked: {
    backgroundColor: "#E4A54E",
    borderColor: "#E4A54E",
  },

  checkText: {
    fontSize: 13,
    color: "#513A11",
  },
});
