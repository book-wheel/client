import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";

import {
  signup,
  login,
  sendEmail,
  verifyEmail,
  getCurrentConsentPolicies,
  type ConsentPolicies,
} from "@/api/auth";
import api, { getApiErrorMessage } from "@/api/axios";

import useSignupForm from "@/hooks/useSignupForm";
import { validateSignup } from "@/utils/signupValidation";
import { matchesDisplayedPolicies } from "@/policies/documents";

export default function Signup() {
  const { form, errors, setErrors, handleChange } = useSignupForm();

  const [emailVerified, setEmailVerified] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const agreeAll = agreeTerms && agreePrivacy;
  const [policies, setPolicies] = useState<ConsentPolicies | null>(null);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true);
  const [policyError, setPolicyError] = useState("");
  const canAgree = !isLoadingPolicies && matchesDisplayedPolicies(policies);

  const [emailMessage, setEmailMessage] = useState("");

  // 로딩 상태
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // 이메일 재전송 쿨다운 (초)
  const [cooldown, setCooldown] = useState(0);

  // 이메일 인증 요청
  const requestEmailVerification = async () => {
    if (isSendingEmail) return;

    try {
      setIsSendingEmail(true);

      const res = await sendEmail(form.email);

      if (res.data.success) {
        setShowCodeInput(true);
        setCooldown(300);

        setEmailMessage("인증번호가 전송되었습니다.");
        setErrors((prev: typeof errors) => ({
          ...prev,
          email: "",
        }));
      } else {
        setErrors((prev: typeof errors) => ({
          ...prev,
          email: res.data.error.message,
        }));
      }
    } catch (error: any) {
      setEmailMessage("");

      setErrors((prev: typeof errors) => ({
        ...prev,
        email:
          error.response?.data?.error?.message ||
          "이메일 인증 요청에 실패했습니다.",
      }));

      console.log(error.response?.data);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // 이메일 인증 확인
  const handleVerifyEmail = async () => {
    try {
      const res = await verifyEmail(form.email, form.emailCode);

      if (res.data.success) {
        setEmailVerified(true);
        setShowCodeInput(false);

        setErrors((prev: typeof errors) => ({
          ...prev,
          email: "",
        }));

        setEmailMessage("이메일 인증이 완료되었습니다.");
      } else {
        setErrors((prev: typeof errors) => ({
          ...prev,
          emailCode: res.data.error.message,
        }));
      }
    } catch (error) {
      setErrors((prev: typeof errors) => ({
        ...prev,
        email: getApiErrorMessage(error, "이메일 인증에 실패했습니다. 다시 시도해주세요."),
      }));
    }
  };

  // Only accept versions of the documents this app actually displays.
  const fetchConsentPolicies = useCallback(async () => {
    setIsLoadingPolicies(true);
    setPolicies(null);
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setPolicyError("");
    setErrors((prev: typeof errors) => ({ ...prev, terms: "" }));
    try {
      const res = await getCurrentConsentPolicies();
      if (!res.data.success || !res.data.data) {
        throw new Error("약관 조회 실패");
      }
      if (!matchesDisplayedPolicies(res.data.data)) {
        setPolicyError("현재 약관에 맞는 문서를 준비 중입니다. 앱을 업데이트하거나 잠시 후 다시 시도해주세요.");
        return;
      }
      setPolicies(res.data.data);
    } catch (error) {
      console.log("약관 버전 조회 실패:", error);
      setPolicyError("약관 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoadingPolicies(false);
    }
  }, [setErrors]);

  useEffect(() => {
    void fetchConsentPolicies();
  }, [fetchConsentPolicies]);

  // 회원가입
  const handleSignup = async () => {
    const validationErrors = validateSignup({
      emailVerified,
      password: form.password,
      passwordCheck: form.passwordCheck,
      agreeTerms,
      agreePrivacy,
    });

    if (isSigningUp) return;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!canAgree || !policies) {
      setErrors((prev: typeof errors) => ({
        ...prev,
        terms: "약관 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      }));
      return;
    }

    try {
      setIsSigningUp(true);

      const signupRes = await signup({
        loginId: form.loginId,
        password: form.password,
        mail: form.email,

        termsAgreed: agreeTerms,
        privacyAgreed: agreePrivacy,

        termsVersion: policies.termsVersion,
        privacyVersion: policies.privacyVersion,

        marketingAgreed: false,
        marketingVersion: null,
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
      if (error.response?.data?.error?.code === "AUTH_028") {
        await fetchConsentPolicies();
        setErrors((prev: typeof errors) => ({
          ...prev,
          terms: "약관 정보를 다시 확인했습니다. 내용을 확인하고 다시 동의해주세요.",
        }));
        return;
      }
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        "회원가입에 실패했습니다.";

      setErrors((prev: typeof errors) => ({
        ...prev,
        loginId: errorMessage,
      }));
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "회원가입" }} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>회원가입</Text>

        {/* 아이디 */}
        {errors.loginId && (
          <Text style={styles.errorText}>{errors.loginId}</Text>
        )}

        <Input
          value={form.loginId}
          onChangeText={(text) => handleChange("loginId", text)}
          placeholder="아이디"
        />

        {/* 이메일 */}
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {emailMessage && <Text style={styles.successText}>{emailMessage}</Text>}
        <Input
          value={form.email}
          onChangeText={(text) => {
            handleChange("email", text);

            setEmailVerified(false);
            setShowCodeInput(false);
          }}
          placeholder="이메일"
          keyboardType="email-address"
          rightButton={{
            label: emailVerified
              ? "인증완료"
              : isSendingEmail
                ? "전송중..."
                : cooldown > 0
                  ? `${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, "0")}`
                  : showCodeInput
                    ? "재전송"
                    : "인증요청",
            onPress: requestEmailVerification,
            disabled: emailVerified || isSendingEmail || cooldown > 0,
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
            style={[styles.checkRow, { justifyContent: "flex-start" }]}
            disabled={!canAgree || isSigningUp}
            onPress={() => {
              const next = !agreeAll;
              setAgreeTerms(next);
              setAgreePrivacy(next);
            }}
          >
            <View style={[styles.checkbox, agreeAll && styles.checked]} />
            <Text style={styles.checkText}>전체 동의</Text>
          </TouchableOpacity>

          <View style={styles.checkRow}>
            <TouchableOpacity
              style={styles.checkContent}
              disabled={!canAgree || isSigningUp}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checked]} />

              <Text style={styles.checkText}>이용약관 동의 (필수)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/terms")}>
              <Text style={styles.linkText}>보기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.checkRow}>
            <TouchableOpacity
              style={styles.checkContent}
              disabled={!canAgree || isSigningUp}
              onPress={() => setAgreePrivacy(!agreePrivacy)}
            >
              <View style={[styles.checkbox, agreePrivacy && styles.checked]} />

              <Text style={styles.checkText}>
                개인정보 수집·이용 동의 (필수)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/collection-consent")}>
              <Text style={styles.linkText}>보기</Text>
            </TouchableOpacity>
          </View>


          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
          {policyError ? (
            <>
              <Text style={styles.errorText}>{policyError}</Text>
              <TouchableOpacity
                disabled={isLoadingPolicies || isSigningUp}
                onPress={() => void fetchConsentPolicies()}
              >
                <Text style={styles.linkText}>약관 다시 확인</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>

        <Button
          title={
            isLoadingPolicies
              ? "약관 확인 중..."
              : isSigningUp
                ? "가입 중..."
                : "회원가입"
          }
          onPress={handleSignup}
          disabled={!canAgree || isSigningUp}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 24,
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

  successText: {
    color: "green",
  },

  termsBox: {
    width: 317,
    marginTop: 30,
    marginBottom: 20,
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

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  checkContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  linkText: {
    fontSize: 13,
    color: "#A66A16",
    textDecorationLine: "underline",
  },
});
