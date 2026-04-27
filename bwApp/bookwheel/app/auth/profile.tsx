import { View, Text, TouchableOpacity } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthCard from "@/components/card";
import ProfileImage from "@/components/profile/image";
import { setupProfile } from "@/api/auth";
import api from "@/api/axios";

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

    if (imageUri) {
      payload.profileImageKey = imageUri;
    }

    console.log("📤 setup-profile payload:", payload);

    try {
      const res = await setupProfile(payload);
      console.log("HEADER:", api.defaults.headers);

      console.log("📥 setup-profile response:", res.data);

      if (res.data.success) {
        router.replace("/");
      } else {
        console.log("서버 에러:", res.data.error);
      }
    } catch (error: any) {
      console.log("setup-profile error");

      if (error.response) {
        console.log("status:", error.response.status);
        console.log("data:", error.response.data);
      } else {
        console.log(error);
      }
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
        <ProfileImage
          uri={imageUri}
          onCameraPress={() => {
            console.log("사진 선택");
          }}
        />

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
