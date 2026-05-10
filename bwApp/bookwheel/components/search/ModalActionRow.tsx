import { Text, TouchableOpacity, View } from "react-native";

import { searchStyles as styles } from "./styles";

type Props = {
  onReset: () => void;
  onApply: () => void;
};

export default function ModalActionRow({ onReset, onApply }: Props) {
  return (
    <View style={styles.modalActionRow}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onReset}
        style={[styles.modalActionButton, styles.modalResetButton]}
      >
        <Text style={styles.modalResetText}>초기화</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onApply}
        style={[styles.modalActionButton, styles.modalApplyButton]}
      >
        <Text style={styles.modalApplyText}>적용</Text>
      </TouchableOpacity>
    </View>
  );
}
