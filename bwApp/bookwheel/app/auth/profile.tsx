import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthCard from "@/components/card";
import ProfileImage from "@/components/profile/image";

export default function Profile() {
  const [text, setText] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  const [nicknameChecked, setNicknameChecked] = useState(false);

  // 닉네임 중복확인 로직
  const checkNickname = () => {
    console.log("Checking nickname:", nickname);
    setNicknameChecked(true);
  };

  useEffect(() => {
    // 예시_ 나중엔 서버에서 가져온 값으로
    const savedNickname = "티티";
    setNickname(savedNickname);
  }, []);

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
          value={text}
          onChangeText={setText}
          placeholder="나와 나의 독서 취향을 한 줄로 적어보세요!"
        />

        {/* 버튼 */}
        <View style={{ width: 317, marginTop: 30 }}>
          <Button title="저장" onPress={() => router.replace("../(tabs)")} />
        </View>
      </AuthCard>
    </View>
  );
}
