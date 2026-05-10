import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { searchStyles as styles } from "./styles";
import type { FilterOption } from "./types";

type Props = {
  visible: boolean;
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export default function FilterSelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.filterSheet}>
              <Text style={styles.filterSheetTitle}>{title}</Text>

              {options.map((option) => {
                const active = option.value === selectedValue;

                return (
                  <TouchableOpacity
                    key={option.value}
                    activeOpacity={0.75}
                    onPress={() => onSelect(option.value)}
                    style={[
                      styles.filterOption,
                      active && styles.filterOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        active && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {active && (
                      <Ionicons name="checkmark" size={20} color="#E4A54E" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
