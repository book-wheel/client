import { Modal, View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (data: { months: number; maxMembers: number }) => void;
};

export default function AdvancedFilterSheet({
  visible,
  onClose,
  onApply,
}: Props) {
  const [months, setMonths] = useState(3);
  const [maxMembers, setMaxMembers] = useState(20);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#0005",
        }}
      >
        <View
          style={{
            backgroundColor: "#FFF",
            padding: 30,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            height: 300,
            gap: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 12 }}>
            고급 필터
          </Text>

          <Text>{months}개월 이내 시작</Text>
          <Slider
            minimumValue={1}
            maximumValue={12}
            step={1}
            value={months}
            onValueChange={setMonths}
          />

          <Text style={{ marginTop: 12 }}>최대 인원: {maxMembers}명</Text>
          <Slider
            minimumValue={2}
            maximumValue={18}
            step={1}
            value={maxMembers}
            onValueChange={setMaxMembers}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancel]}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>닫기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.apply]}
              onPress={() => onApply({ months, maxMembers })}
            >
              <Text style={styles.applyText}>적용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  cancel: {
    backgroundColor: "#E5E5E5",
  },

  apply: {
    backgroundColor: "#E4A54E",
  },

  cancelText: {
    color: "#777",
    fontWeight: "600",
  },

  applyText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
