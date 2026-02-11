import { useState } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { common } from "@/styles/common";

export default function Explore() {
  const [open, setOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true); // 그룹 타입
  const [step, setStep] = useState<1 | 2>(1);

  const openJoin = (privateRoom: boolean) => {
    setIsPrivate(privateRoom);
    setStep(privateRoom ? 1 : 2); // 공개방이면 바로 2단계
    setOpen(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 비공개방 가입 */}
      <TouchableOpacity onPress={() => openJoin(true)}>
        <Text style={[common.button, { marginTop: 20 }]}>
          (비공개)그룹명3 가입
        </Text>
      </TouchableOpacity>

      {/* 공개방 가입 */}
      <TouchableOpacity onPress={() => openJoin(false)}>
        <Text style={[common.button, { marginTop: 20 }]}>
          (공개)그룹명4 가입
        </Text>
      </TouchableOpacity>

      {/* 가입 모달------------------------------------------------ */}
      {open && (
        <View>
          {step === 1 && (
            <>
              <Text>비밀번호 입력</Text>
              <TouchableOpacity onPress={() => setStep(2)}>
                <Text style={[common.button, { marginTop: 20 }]}>다음</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text>가입 메시지</Text>

              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={[common.button, { marginTop: 20 }]}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={[common.button, { marginTop: 20 }]}>가입</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}
