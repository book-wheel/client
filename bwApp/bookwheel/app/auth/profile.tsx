import { Alert, Text, View } from "react-native";

import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { setupProfile } from "@/api/auth";
import { uploadImage } from "@/api/images";
import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthCard from "@/components/card";
import ProfileImage from "@/components/profile/image";
import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [comment, setComment] = useState("");
  const [nickname, setNickname] = React.useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  const [nicknameChecked, setNicknameChecked] = useState(false);

  //토큰확인차...!
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      console.log("TOKEN:", token);
    };

    checkToken();
  }, []);

  // 닉네임 중복확인 로직
  const checkNickname = () => {
    console.log("Checking nickname:", nickname);
    setNicknameChecked(true);
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
    if (!nickname.trim()) {
      console.log("닉네임 입력 필요");
      return;
    }

    if (!nicknameChecked) {
      console.log("닉네임 중복 확인 필요");
      return;
    }

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
        router.replace("/");
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
        error.message ?? "프로필 설정 중 오류가 발생하였습니다.",
      );
    }
  };

  return (
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

        <Input
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
        />

        <Input
          style={{ height: 93 }}
          value={comment}
          onChangeText={setComment}
          placeholder="나와 나의 독서 취향을 한 줄로 적어보세요!"
        />

        {/* 버튼 */}
        <View style={{ width: 317, marginTop: 30 }}>
          <Button title="저장" onPress={handleSetupProfile} />
        </View>
      </AuthCard>
    </View>
  );
}
