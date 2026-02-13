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
        {/* 인풋박스 */}
        <Input
          value={nickname}
          editable={false}
          onChangeText={(text) => {
            setNickname(text);
          }}
          placeholder="닉네임"
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
