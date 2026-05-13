import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";
import { router } from "expo-router";
import { Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGroupCreateStore } from "@/store/groupCreateStore";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

export default function Step1() {
  const steps = ["정보입력", "운영방식", "기타"];
  const currentStep = 0; // Step1

  const { groupName, groupComment, maxMembers, startDate, setField } =
    useGroupCreateStore();

  const [peopleOpen, setPeopleOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

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
          정보 입력
        </Text>

        <Text
          style={{
            marginLeft: 46,
            marginBottom: 6,
            marginTop: 26,
            color: "#513A11",
          }}
        >
          모임 이름 ({groupName.length}/10)
        </Text>
        <Input
          value={groupName}
          onChangeText={(t) => t.length <= 10 && setField("groupName", t)}
          placeholder="책바퀴독서모임"
        />

        <Text style={{ marginLeft: 46, marginBottom: 6, color: "#513A11" }}>
          코멘트 ({groupComment.length}/50)
        </Text>
        <Input
          value={groupComment}
          onChangeText={(t) => t.length <= 50 && setField("groupComment", t)}
          placeholder="독서 초보도 환영하는 느긋한 독서 모임~"
        />

        <Text style={{ marginLeft: 46, marginBottom: 6, color: "#513A11" }}>
          최대 인원
        </Text>

        <TouchableOpacity onPress={() => setPeopleOpen(true)}>
          <View pointerEvents="none">
            <Input
              value={maxMembers ? `${maxMembers}명` : ""}
              placeholder="선택하세요"
              editable={false}
              onChangeText={() => {}}
            />
          </View>
        </TouchableOpacity>

        <Modal visible={peopleOpen} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "#0005",
              justifyContent: "center",
              padding: 40,
            }}
          >
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 12,
                padding: 20,
              }}
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={{ paddingVertical: 10 }}
                  onPress={() => {
                    setField("maxMembers", n);
                    setPeopleOpen(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{n}명</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity onPress={() => setPeopleOpen(false)}>
                <Text
                  style={{ textAlign: "center", color: "#999", marginTop: 10 }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={{ marginLeft: 46, marginBottom: 6, color: "#513A11" }}>
          시작 날짜
        </Text>

        <TouchableOpacity onPress={() => setDateOpen(true)}>
          <View pointerEvents="none">
            <Input
              value={startDate ? new Date(startDate).toLocaleDateString() : ""}
              placeholder="날짜 선택"
              editable={false}
              onChangeText={() => {}}
            />
          </View>
        </TouchableOpacity>

        {dateOpen && (
          <DateTimePicker
            value={startDate ? new Date(startDate) : new Date()}
            mode="date"
            display="spinner"
            onChange={(e, d) => {
              if (d) setField("startDate", d.toISOString().slice(0, 10));
              setDateOpen(false);
            }}
          />
        )}
      </View>

      {/* 하단 버튼 */}
      <TouchableOpacity
        style={[common.button, { marginBottom: 56, marginHorizontal: 24 }]}
        onPress={() => router.replace("./step2")}
      >
        <Text>다음</Text>
      </TouchableOpacity>
    </View>
  );
}
