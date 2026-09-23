import { showApiError } from "@/api/axios";
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError } from "axios";

import {
  setupProfile,
  checkNicknameDuplicate,
  type ProfileSetupData,
  type RequiredConsent,
} from "@/api/auth";
import { getImageFileInfo, uploadProfileImage } from "@/api/images";
import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthCard from "@/components/card";
import ProfileImage from "@/components/profile/image";
import * as ImagePicker from "expo-image-picker";
import type { ApiResponse } from "@/types/api";
import {
  clearSocialOnboarding,
  getSavedSocialConsent,
  getSocialOnboardingStep,
  restartSocialConsent,
} from "@/utils/socialOnboarding";

export default function Profile() {
  const [comment, setComment] = useState("");
  const [nickname, setNickname] = React.useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);

  const [nicknameChecked, setNicknameChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [socialConsent, setSocialConsent] = useState<
    RequiredConsent | null | undefined
  >(undefined);

  useEffect(() => {
    let isActive = true;

    const loadSocialConsent = async () => {
      try {
        const step = await getSocialOnboardingStep();

        if (step === "consent") {
          router.replace("/auth/social-consent");
          return;
        }

        if (step !== "profile") {
          if (isActive) setSocialConsent(null);
          return;
        }

        const savedConsent = await getSavedSocialConsent();
        if (!savedConsent) {
          await restartSocialConsent();
          router.replace("/auth/social-consent");
          return;
        }

        if (isActive) setSocialConsent(savedConsent);
      } catch (error) {
        console.log("소셜 가입 동의 정보 확인 실패:", error);
        await restartSocialConsent();
        router.replace("/auth/social-consent");
      }
    };

    void loadSocialConsent();

    return () => {
      isActive = false;
    };
  }, []);

  // 닉네임 중복확인 로직
  const checkNickname = async () => {
    if (!nickname.trim()) {
      setNicknameMessage("닉네임을 입력해주세요.");
      setNicknameChecked(false);
      return;
    }

    try {
      await checkNicknameDuplicate(nickname);

      setNicknameChecked(true);
      setNicknameMessage("사용 가능한 닉네임입니다.");
    } catch (error: any) {
      console.log(error);

      setNicknameChecked(false);

      if (error.response?.status === 400) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
      } else {
        setNicknameMessage("닉네임 확인 중 오류가 발생했습니다.");
      }
    }
  };

  const handlePickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("오류", "사진 접근 권한이 필요합니다.", [{ text: "확인" }]);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    setImageUri(asset.uri);
    setImageFileName(asset.fileName ?? null);
    setImageMimeType(asset.mimeType ?? null);
  };

  //회원가입(프로필저장)로직
  const handleSetupProfile = async () => {
    if (loading || socialConsent === undefined) return;

    if (!nickname.trim()) {
      console.log("닉네임 입력 필요");
      return;
    }

    if (!nicknameChecked) {
      console.log("닉네임 중복 확인 필요");
      return;
    }

    setLoading(true);

    const payload: ProfileSetupData = {
      nickname,
      comment: comment || "",
      ...(socialConsent ?? {}),
    };

    try {
      if (imageUri) {
        const { fileName, mimeType } = getImageFileInfo(
          imageFileName,
          imageMimeType,
          `profile_${Date.now()}`,
        );

        const profileImageKey = await uploadProfileImage(
          imageUri,
          fileName,
          mimeType,
        );

        payload.profileImageKey = profileImageKey;
      }

      const res = await setupProfile(payload);

      if (res.data.success && res.data.data) {
        const { accessToken, refreshToken } = res.data.data;
        if (!accessToken || !refreshToken) {
          throw new Error("프로필 설정 후 인증 토큰이 누락되었습니다.");
        }

        await AsyncStorage.multiSet([
          ["accessToken", accessToken],
          ["refreshToken", refreshToken],
        ]);
        await clearSocialOnboarding();

        Alert.alert("완료", "프로필 설정이 완료되었습니다.", [
          {
            text: "확인",
            onPress: () => router.replace("/"),
          },
        ]);
      } else {
        Alert.alert(
          "오류",
          res.data.error?.message ?? "프로필 설정에 실패하였습니다.",
          [{ text: "확인" }],
        );
      }
    } catch (error: unknown) {
      console.log("프로필 설정 에러:", error);

      if (
        isAxiosError<ApiResponse<unknown>>(error) &&
        error.response?.data?.error?.code === "AUTH_028"
      ) {
        await restartSocialConsent();
        Alert.alert(
          "약관 재확인 필요",
          "약관이 변경되어 다시 확인과 동의가 필요합니다.",
          [
            {
              text: "확인",
              onPress: () => router.replace("/auth/social-consent"),
            },
          ],
        );
        return;
      }

      showApiError(error, "프로필 설정 중 오류가 발생하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (socialConsent === undefined) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F7EDE0",
        }}
      >
        <ActivityIndicator color="#E4A54E" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
            프로필 설정
          </Text>
          <ProfileImage uri={imageUri} onCameraPress={handlePickProfileImage} />

          {nicknameMessage && (
            <Text
              style={{
                color: nicknameChecked ? "#6BA368" : "#E4A54E",
                width: 317,
                marginBottom: 4,
              }}
            >
              {nicknameMessage}
            </Text>
          )}
          <Input
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              setNicknameChecked(false); // 닉네임 바뀌면 다시
              setNicknameMessage(""); // 메시지도 초기화
            }}
            placeholder="닉네임"
            rightButton={{
              label: nicknameChecked ? "사용가능" : "중복확인",
              onPress: checkNickname,
              disabled: nicknameChecked,
            }}
          />

          <Input
            style={{ height: 93 }}
            value={comment}
            onChangeText={setComment}
            placeholder="나와 나의 독서 취향을 한 줄로 적어보세요!"
          />

          {/* 버튼 */}
          <View style={{ width: 317, marginTop: 30 }}>
            <Button
              title={loading ? "저장 중..." : "저장"}
              onPress={handleSetupProfile}
            />
          </View>
        </AuthCard>
      </View>
    </KeyboardAvoidingView>
  );
}
