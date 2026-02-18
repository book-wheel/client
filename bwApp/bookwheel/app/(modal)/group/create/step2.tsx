import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";
import { router } from "expo-router";
import { useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";

export default function Step1() {
  const steps = ["정보입력", "운영방식", "기타"];
  const currentStep = 1; // Step1

  const [rule, setRule] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1 }}>
      {/* 상단 헤더 */}
      <View style={{ paddingHorizontal: 24, paddingTop: 40 }}>
        {/* 스텝 텍스트 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          {steps.map((label, i) => {
            const active = i === currentStep;
            return (
              <View
                key={label}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: active ? "700" : "400",
                    color: active ? "#E4A54E" : "#B5B5B5",
                  }}
                >
                  {label}
                </Text>

                {i !== steps.length - 1 && (
                  <Text style={{ marginHorizontal: 8, color: "#DDD" }}>‧</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* 중간 콘텐츠 영역 */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            margin: 16,
            marginLeft: 26,
            fontWeight: "bold",
            color: "#513A11",
          }}
        >
          운영 방식
        </Text>

        <Text style={{ marginLeft: 46, marginBottom: 6, color: "#513A11" }}>
          모임 규칙
        </Text>

        <Input
          value={rule}
          onChangeText={(t) => t.length <= 100 && setRule(t)}
          placeholder="예) 기간 내 완독하기"
          multiline
        />

        <Text style={{ marginLeft: 46, marginBottom: 10, color: "#513A11" }}>
          공개 여부
        </Text>

        <View style={{ flexDirection: "row", gap: 12, marginHorizontal: 24 }}>
          <Button
            title="공개"
            onPress={() => setIsPublic(true)}
            style={{
              flex: 1,
              backgroundColor: isPublic ? "#E4A54E" : "#FDF9EA",
            }}
            textStyle={{ color: isPublic ? "#FFF" : "#FDF9EA" }}
          />

          <Button
            title="비공개"
            onPress={() => setIsPublic(false)}
            style={{
              flex: 1,
              backgroundColor: !isPublic ? "#E4A54E" : "#FDF9EA",
            }}
            textStyle={{ color: !isPublic ? "#FFF" : "#FDF9EA" }}
          />
        </View>
        {!isPublic && (
          <>
            <Text style={{ marginLeft: 46, marginBottom: 6, color: "#513A11" }}>
              비밀번호
            </Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호 입력"
              secureTextEntry
            />
          </>
        )}
      </View>

      {/* 하단 버튼 */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 56,
          marginHorizontal: 24,
        }}
      >
        <TouchableOpacity
          style={[common.button, { flex: 1 }]}
          onPress={() => router.replace("./step1")}
        >
          <Text>이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[common.button, { flex: 1 }]}
          onPress={() => router.replace("./step3")}
        >
          <Text>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
