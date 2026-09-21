import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, Stack } from "expo-router";

import { getCurrentConsentPolicies, type ConsentPolicies } from "@/api/auth";
import Button from "@/components/Button";
import { matchesDisplayedPolicies } from "@/policies/documents";
import { saveSocialConsent } from "@/utils/socialOnboarding";

export default function SocialConsent() {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [policies, setPolicies] = useState<ConsentPolicies | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const agreeAll = agreeTerms && agreePrivacy;
  const canAgree = !isLoading && matchesDisplayedPolicies(policies);

  const fetchPolicies = useCallback(async () => {
    setIsLoading(true);
    setPolicies(null);
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setErrorMessage("");

    try {
      const response = await getCurrentConsentPolicies();
      if (!response.data.success || !response.data.data) {
        throw new Error("약관 조회 실패");
      }

      if (!matchesDisplayedPolicies(response.data.data)) {
        setErrorMessage(
          "현재 약관에 맞는 문서를 준비 중입니다. 앱을 업데이트하거나 잠시 후 다시 시도해주세요.",
        );
        return;
      }

      setPolicies(response.data.data);
    } catch (error) {
      console.log("소셜 가입 약관 버전 조회 실패:", error);
      setErrorMessage(
        "약관 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPolicies();
  }, [fetchPolicies]);

  const handleContinue = async () => {
    if (isSaving) return;

    if (!agreeAll) {
      setErrorMessage("필수 약관에 모두 동의해주세요.");
      return;
    }

    if (!canAgree || !policies) {
      setErrorMessage(
        "약관 정보를 확인할 수 없습니다. 다시 시도해주세요.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      await saveSocialConsent(policies);
      router.replace("/auth/profile");
    } catch (error) {
      console.log("소셜 가입 약관 동의 저장 실패:", error);
      setErrorMessage(
        "동의 정보를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "약관 동의",
          gestureEnabled: false,
          headerBackVisible: false,
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>서비스 이용을 위한 동의</Text>
          <Text style={styles.description}>
            Bookwheel 가입을 완료하려면 필수 약관을 확인하고
            동의해주세요.
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#E4A54E" />
              <Text style={styles.loadingText}>약관 확인 중...</Text>
            </View>
          ) : (
            <View style={styles.termsBox}>
              <TouchableOpacity
                accessibilityRole="checkbox"
                accessibilityState={{ checked: agreeAll, disabled: !canAgree }}
                style={[styles.checkRow, styles.checkAllRow]}
                disabled={!canAgree || isSaving}
                onPress={() => {
                  const next = !agreeAll;
                  setAgreeTerms(next);
                  setAgreePrivacy(next);
                  setErrorMessage("");
                }}
              >
                <View style={[styles.checkbox, agreeAll && styles.checked]} />
                <Text style={styles.checkText}>전체 동의</Text>
              </TouchableOpacity>

              <View style={styles.checkRow}>
                <TouchableOpacity
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: agreeTerms,
                    disabled: !canAgree,
                  }}
                  style={styles.checkContent}
                  disabled={!canAgree || isSaving}
                  onPress={() => {
                    setAgreeTerms((value) => !value);
                    setErrorMessage("");
                  }}
                >
                  <View
                    style={[styles.checkbox, agreeTerms && styles.checked]}
                  />
                  <Text style={styles.checkText}>이용약관 동의 (필수)</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/auth/terms")}>
                  <Text style={styles.linkText}>보기</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.checkRow}>
                <TouchableOpacity
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: agreePrivacy,
                    disabled: !canAgree,
                  }}
                  style={styles.checkContent}
                  disabled={!canAgree || isSaving}
                  onPress={() => {
                    setAgreePrivacy((value) => !value);
                    setErrorMessage("");
                  }}
                >
                  <View
                    style={[styles.checkbox, agreePrivacy && styles.checked]}
                  />
                  <Text style={styles.checkText}>
                    개인정보 수집·이용 동의 (필수)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/auth/collection-consent")}
                >
                  <Text style={styles.linkText}>보기</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
              {!canAgree && !isLoading ? (
                <TouchableOpacity
                  disabled={isSaving}
                  onPress={() => void fetchPolicies()}
                >
                  <Text style={styles.retryText}>약관 다시 확인</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          <Button
            title={isSaving ? "처리 중..." : "동의하고 계속"}
            onPress={handleContinue}
            disabled={!canAgree || isSaving}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "#F7EDE0",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    color: "#513A11",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    color: "#777777",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
  },
  loadingContainer: {
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#777777",
    fontSize: 13,
    marginTop: 10,
  },
  termsBox: {
    marginBottom: 18,
  },
  checkAllRow: {
    justifyContent: "flex-start",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  checkRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 4,
    marginRight: 9,
  },
  checked: {
    borderColor: "#E4A54E",
    backgroundColor: "#E4A54E",
  },
  checkText: {
    flexShrink: 1,
    color: "#513A11",
    fontSize: 13,
  },
  linkText: {
    color: "#E4A54E",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  errorContainer: {
    marginBottom: 14,
  },
  errorText: {
    color: "#D88421",
    fontSize: 13,
    lineHeight: 19,
  },
  retryText: {
    color: "#E4A54E",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  continueButton: {
    width: "100%",
    marginBottom: 0,
  },
});
