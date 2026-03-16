import { View, Text, TouchableOpacity } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthCard from "@/components/card";
import ProfileImage from "@/components/profile/image";
import { signup } from "@/api/auth";

export default function Profile() {
  const params = useLocalSearchParams();

  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const password = Array.isArray(params.password)
    ? params.password[0]
    : params.password;

  const [comment, setComment] = useState("");
  const [nickname, setNickname] = React.useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  const [nicknameChecked, setNicknameChecked] = useState(false);

  // 닉네임 중복확인 로직
  const checkNickname = () => {
    console.log("Checking nickname:", nickname);
    setNicknameChecked(true);
  };

  //회원가입(프로필저장)로직
  const handleSignup = async () => {
    try {
      await signup({
        userId,
        password,
        mail: email,
        nickname,
        comment,
      });

      router.replace("/auth/login");
    } catch (e) {
      console.log(e);
    }

    //콘솔확인
    try {
      const payload = {
        userId,
        password,
        mail: email,
        nickname,
        comment,
      };

      console.log("signup payload:", payload);

      const res = await signup(payload);

      console.log("signup response:", res.data);
    } catch (error: any) {
      console.log("signup error:", error.response?.data);
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
          <Button title="저장" onPress={handleSignup} />
        </View>
      </AuthCard>
    </View>
  );
}
