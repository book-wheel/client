import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";

import { signup } from "@/api/auth";
import { sendEmail, verifyEmail } from "@/api/auth";

export default function Signup() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [emailCode, setEmailCode] = useState("");

  //메일 인증요청 로직
  const requestEmailVerification = async () => {
    try {
      const res = await sendEmail(email);

      if (res.data.success) {
        setShowCodeInput(true);
        console.log("메일 발송 성공:", res.data.data);
      } else {
        console.log("실패:", res.data.error.message);
      }
    } catch (error) {
      console.log("요청 실패:", error);
    }
  };

  //메일 인증확인 로직
  const handleVerifyEmail = async () => {
    try {
      const res = await verifyEmail(email, emailCode);

      if (res.data.success) {
        setEmailVerified(true);
        setShowCodeInput(false);
      } else {
        console.log(res.data.error.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //비밀번호 일치 여부
  const isPasswordMatch = password === passwordCheck;

  //회원가입 로직
  const handleSignup = async () => {
    if (!emailVerified) {
      console.log("이메일 인증 필요");
      return;
    }

    if (!isPasswordMatch) {
      console.log("비밀번호 불일치");
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      console.log("약관 동의 필요");
      return;
    }

    try {
      // const res = await signup({
      //   userId,
      //   mail: email,
      //   password,
      //  });

      // console.log(res.data);
      router.push({
        pathname: "/auth/profile",
        params: {
          userId,
          email,
          password,
        },
      });
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

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
          editable={!emailVerified}
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
        <Button title="회원가입" onPress={handleSignup} />
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
