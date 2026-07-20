import { AntDesign, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  value: string;
  isSpoilerChecked: boolean;
  onChangeText: (text: string) => void;
  onToggleSpoiler: () => void;
  onExpand: () => void;
  onSubmit: () => void;
}

export default function ReviewComposer({
  value,
  isSpoilerChecked,
  onChangeText,
  onToggleSpoiler,
  onExpand,
  onSubmit,
}: Props) {
  const hasContent = Boolean(value.trim());

  return (
    <View style={styles.inputSection}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>코멘트 달기</Text>

        <TouchableOpacity style={styles.spoilerRow} onPress={onToggleSpoiler} activeOpacity={0.8}>
          <Ionicons
            name={isSpoilerChecked ? "checkbox" : "square-outline"}
            size={20}
            color={isSpoilerChecked ? "#D89A3A" : "#D3D3D3"}
          />
          <Text style={styles.spoilerText}>스포 방지</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.composerBar}>
        <TextInput
          style={styles.composerInput}
          placeholder="코멘트를 남겨주세요."
          placeholderTextColor="#B3B3B3"
          value={value}
          onChangeText={onChangeText}
          multiline={false}
          returnKeyType="done"
        />

        <TouchableOpacity style={styles.expandIcon} onPress={onExpand} activeOpacity={0.8}>
          <AntDesign name="arrows-alt" size={18} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, hasContent ? styles.submitButtonActive : styles.submitButtonDisabled]}
          disabled={!hasContent}
          onPress={onSubmit}
          activeOpacity={0.9}
        >
          <Text style={[styles.submitText, hasContent ? styles.submitTextActive : styles.submitTextDisabled]}>게시</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputSection: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#513A11",
    marginBottom: 14,
  },
  spoilerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  spoilerText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  composerBar: {
    minHeight: 58,
    borderWidth: 1.4,
    borderColor: "#8B6A33",
    borderRadius: 999,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 8,
  },
  composerInput: {
    flex: 1,
    fontSize: 14,
    color: "#513A11",
    paddingVertical: 12,
  },
  expandIcon: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 4,
  },
  submitButton: {
    minWidth: 78,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  submitButtonActive: {
    backgroundColor: "#D89A3A",
  },
  submitButtonDisabled: {
    backgroundColor: "#EFEFEF",
  },
  submitText: {
    fontSize: 14,
    fontWeight: "700",
  },
  submitTextActive: {
    color: "#3D2A0C",
  },
  submitTextDisabled: {
    color: "#A8A8A8",
  },
});
