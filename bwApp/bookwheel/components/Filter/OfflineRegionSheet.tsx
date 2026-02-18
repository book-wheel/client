import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";

const regions = [
  "전체",
  "서울",
  "경기",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const allRegions = regions.filter((r) => r !== "전체");

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (regions: string[]) => void;
};

export default function OfflineRegionSheet({
  visible,
  onClose,
  onSelect,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (r: string) => {
    if (r === "전체") {
      setSelected(["전체", ...allRegions]);
    } else {
      setSelected((prev) => {
        const next = prev.includes(r)
          ? prev.filter((x) => x !== r)
          : [...prev, r];

        const withoutAll = next.filter((x) => x !== "전체");

        return withoutAll.length === allRegions.length
          ? ["전체", ...allRegions]
          : withoutAll;
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <Text style={styles.title}>지역 선택</Text>

              <View style={styles.grid}>
                {regions.map((r) => {
                  const active =
                    r === "전체"
                      ? selected.includes("전체")
                      : selected.includes(r);

                  return (
                    <TouchableOpacity
                      key={r}
                      style={[styles.box, active && styles.active]}
                      onPress={() => toggle(r)}
                    >
                      <Text
                        style={[styles.boxText, active && styles.activeText]}
                      >
                        {r}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.cancel]}
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>닫기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.apply]}
                  onPress={() => {
                    onSelect(selected);
                    onClose();
                  }}
                >
                  <Text style={styles.applyText}>적용</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#0005",
  },
  sheet: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 22,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  box: {
    width: "22%",
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#E4A54E",
    borderColor: "#E4A54E",
  },
  boxText: {
    fontSize: 12,
    color: "#555",
    lineHeight: 16,
    textAlignVertical: "center",
  },
  activeText: {
    color: "#FFF",
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 40,
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
