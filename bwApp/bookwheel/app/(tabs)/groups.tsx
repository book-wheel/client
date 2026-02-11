import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { common } from "@/styles/common";
import { useState } from "react";

export default function Groups() {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 특정그룹으로 이동 */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/group/[id]/home",
            params: { id: "3" },
          })
        }
      >
        <Text style={[common.button, { marginTop: 20 }]}>ex.그룹명3</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={[common.button, { margin: 20 }]}>+</Text>
      </TouchableOpacity>

      {/* 모임생성 및 탐색 */}
      {open && (
        <View>
          <TouchableOpacity onPress={() => router.push("/group/create/step1")}>
            <Text style={[common.button, { marginTop: 20 }]}>모임 생성</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/group/explore")}>
            <Text style={[common.button, { marginTop: 20 }]}>모임 탐색</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
