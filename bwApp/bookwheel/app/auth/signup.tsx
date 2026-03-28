import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";

import { signup, login, sendEmail, verifyEmail } from "@/api/auth";
import api from "@/api/axios";

import useSignupForm from "@/hooks/useSignupForm";
import { validateSignup } from "@/utils/signupValidation";

export default function Signup() {
  const { form, errors, setErrors, handleChange } = useSignupForm();

  const [emailVerified, setEmailVerified] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 이메일 인증 요청
  const requestEmailVerification = async () => {
    try {
      const res = await sendEmail(form.email);

      if (res.data.success) {
        setShowCodeInput(true);
      } else {
        setErrors({ email: res.data.error.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 이메일 인증 확인
  const handleVerifyEmail = async () => {
    try {
      const res = await verifyEmail(form.email, form.emailCode);

      if (res.data.success) {
        setEmailVerified(true);
        setShowCodeInput(false);
      } else {
        setErrors({ emailCode: res.data.error.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 회원가입
  const handleSignup = async () => {
    const validationErrors = validateSignup({
      emailVerified,
      password: form.password,
      passwordCheck: form.passwordCheck,
      agreeTerms,
      agreePrivacy,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const signupRes = await signup({
        loginId: form.loginId,
        password: form.password,
        mail: form.email,
      });

      if (!signupRes.data.success) return;

      const loginRes = await login({
        loginId: form.loginId,
        password: form.password,
      });

      const { accessToken, isProfileSet } = loginRes.data.data;

      api.defaults.headers.Authorization = `Bearer ${accessToken}`;

      router.replace(isProfileSet ? "/" : "/auth/profile");
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  // 전체동의 자동체크
  useEffect(() => {
    setAgreeAll(agreeTerms && agreePrivacy);
  }, [agreeTerms, agreePrivacy]);

  return (
    <>
      <Stack.Screen options={{ title: "회원가입" }} />

      <View style={styles.container}>
        <Text style={styles.title}>회원가입</Text>

        {/* 아이디 */}
        <Input
          value={form.loginId}
          onChangeText={(text) => handleChange("loginId", text)}
          placeholder="아이디"
        />

        {/* 이메일 */}
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <Input
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
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

        {/* 인증코드 */}
        {showCodeInput && (
          <>
            {errors.emailCode && (
              <Text style={styles.errorText}>{errors.emailCode}</Text>
            )}

            <Input
              value={form.emailCode}
              onChangeText={(text) => handleChange("emailCode", text)}
              placeholder="인증번호 입력"
              keyboardType="numeric"
              rightButton={{
                label: "확인",
                onPress: handleVerifyEmail,
              }}
            />
          </>
        )}

        {/* 비밀번호 */}
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <Input
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          placeholder="비밀번호"
          secureTextEntry
        />

        {/* 비밀번호 확인 */}
        {errors.passwordCheck && (
          <Text style={styles.errorText}>{errors.passwordCheck}</Text>
        )}

        <Input
          value={form.passwordCheck}
          onChangeText={(text) => handleChange("passwordCheck", text)}
          placeholder="비밀번호 확인"
          secureTextEntry
        />

        {/* 약관 동의 */}

        <View style={styles.termsBox}>
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

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checked]} />
            <Text style={styles.checkText}>이용약관 동의 (필수)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setAgreePrivacy(!agreePrivacy)}
          >
            <View style={[styles.checkbox, agreePrivacy && styles.checked]} />
            <Text style={styles.checkText}>개인정보 처리방침 동의 (필수)</Text>
          </TouchableOpacity>

          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
        </View>

        <Button title="회원가입" onPress={handleSignup} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    marginBottom: 30,
    color: "#513A11",
  },

  errorText: {
    color: "#E4A54E",
    width: "80%",
    marginBottom: 4,
  },

  termsBox: {
    width: 317,
    marginTop: 30,
    marginBottom: 20,
  },

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
