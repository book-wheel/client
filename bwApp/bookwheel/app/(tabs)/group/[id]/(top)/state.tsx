import { router, useLocalSearchParams } from "expo-router";
import { common } from "@/styles/common";
import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";

export default function State() {
  const { id: rawId, completed } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [status, setStatus] = useState<"idle" | "done" | "ready">("idle");

  useEffect(() => {
    if (completed === "true") {
      setStatus("done");
    }
  }, [completed]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 독서 등록- 추후에 기간 확인 분기 도입 */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/search",
            params: { id, from: "add" },
          })
        }
      >
        <Text style={[common.button, { marginTop: 20 }]}>책 등록하기</Text>
      </TouchableOpacity>

      {/* 완독 인증 관련 관리 버튼 */}
      {status === "idle" && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/group/[id]/completed-books",
              params: { id },
            })
          }
        >
          <Text style={[common.button, { marginTop: 20 }]}>완독 인증</Text>
        </TouchableOpacity>
      )}

      {status === "done" && (
        <TouchableOpacity onPress={() => setStatus("ready")}>
          <Text style={[common.button, { marginTop: 20 }]}>전달 완료</Text>
        </TouchableOpacity>
      )}

      {status === "ready" && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/group/[id]/this-session",
              params: { id },
            })
          }
        >
          <Text style={[common.button, { marginTop: 20 }]}>준비 완료</Text>
        </TouchableOpacity>
      )}

      {/* 멤버 */}
      <TouchableOpacity onPress={() => router.push("/group/[id]/member/[id]")}>
        <Text style={[common.button, { marginTop: 20 }]}>[멤버이름]</Text>
      </TouchableOpacity>
    </View>
  );
}
