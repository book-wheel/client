import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { common } from "@/styles/common";
import { router } from "expo-router";
import OfflineRegionSheet from "@/components/Filter/OfflineRegionSheet";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Step1() {
  const steps = ["정보입력", "운영방식", "기타"];
  const currentStep = 2; // Step1

  const [isOffline, setIsOffline] = useState(true);
  const [regionOpen, setRegionOpen] = useState(false);
  const [region, setRegion] = useState<string | null>(null);

  const [period, setPeriod] = useState("");

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
          기타
        </Text>

        <Text style={{ marginLeft: 46, marginBottom: 6, color: "#513A11" }}>
          독서 기간
        </Text>

        <Input
          value={period}
          onChangeText={(t) => /^[0-9]*$/.test(t) && setPeriod(t)}
          placeholder="예) 8"
        />

        {/* 온라인 / 오프라인 */}
        <Text style={{ marginLeft: 46, marginBottom: 10, color: "#513A11" }}>
          모임 방식
        </Text>

        <View style={{ flexDirection: "row", gap: 12, marginHorizontal: 24 }}>
          <Button
            title="오프라인"
            onPress={() => setIsOffline(true)}
            style={{
              flex: 1,
              backgroundColor: isOffline ? "#E4A54E" : "#FDF9EA",
            }}
            textStyle={{ color: isOffline ? "#FFF" : "#FDF9EA" }}
          />

          <Button
            title="온라인"
            onPress={() => setIsOffline(false)}
            style={{
              flex: 1,
              backgroundColor: !isOffline ? "#E4A54E" : "#FDF9EA",
            }}
            textStyle={{ color: !isOffline ? "#FFF" : "#FDF9EA" }}
          />
        </View>

        {isOffline && (
          <>
            <Text style={{ marginLeft: 46, marginBottom: 6, color: "#513A11" }}>
              지역 선택
            </Text>

            <TouchableOpacity onPress={() => setRegionOpen(true)}>
              <View pointerEvents="none">
                <Input
                  value={region ?? ""}
                  placeholder="지역 선택"
                  editable={false}
                  onChangeText={() => {}}
                />
              </View>
            </TouchableOpacity>

            <OfflineRegionSheet
              visible={regionOpen}
              onClose={() => setRegionOpen(false)}
              onSelect={(list) => {
                // 마지막으로 누른 것만 유지
                const last = list[list.length - 1];
                if (last && last !== "전체") setRegion(last);
              }}
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
          onPress={() => router.replace("./step2")}
        >
          <Text>이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[common.button, { flex: 1 }]}
          onPress={() => router.replace("/group/3/home")}
        >
          <Text>생성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
