import {
  Alert,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { router } from "expo-router";
import React, { useState } from "react";

import { setupProfile, checkNicknameDuplicate } from "@/api/auth";
import { uploadImage } from "@/api/images";
import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthCard from "@/components/card";
import ProfileImage from "@/components/profile/image";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const [comment, setComment] = useState("");
  const [nickname, setNickname] = React.useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  const [nicknameChecked, setNicknameChecked] = useState(false);

  const [loading, setLoading] = useState(false);

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
      Alert.alert("알림", "사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    setImageUri(result.assets[0].uri);
  };

  //회원가입(프로필저장)로직
  const handleSetupProfile = async () => {
    if (loading) return;

    if (!nickname.trim()) {
      console.log("닉네임 입력 필요");
      return;
    }

    if (!nicknameChecked) {
      console.log("닉네임 중복 확인 필요");
      return;
    }

    setLoading(true);

    const payload: any = {
      nickname,
      comment: comment || "",
    };

    try {
      if (imageUri) {
        const fileName = `profile_${Date.now()}.jpg`;

        const profileImageKey = await uploadImage(
          imageUri,
          fileName,
          "profiles",
          "image/jpeg",
        );

        payload.profileImageKey = profileImageKey;
      }

      console.log("📤 setup-profile payload:", payload);

      const res = await setupProfile(payload);

      console.log("📥 setup-profile response:", res.data);

      if (res.data.success) {
        Alert.alert("완료", "프로필 설정이 완료되었습니다.", [
          {
            text: "확인",
            onPress: () => router.replace("/"),
          },
        ]);
      } else {
        Alert.alert(
          "프로필 설정 실패",
          res.data.error?.message ?? "프로필 설정에 실패하였습니다.",
        );
      }
    } catch (error: any) {
      console.log("프로필 설정 에러:", error);

      Alert.alert(
        "프로필 설정 실패",
        error.response?.data?.error?.message ??
          "프로필 설정 중 오류가 발생하였습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

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
