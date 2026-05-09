import { useEffect, useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import ModalActionRow from "./ModalActionRow";
import { searchStyles as styles } from "./styles";
import type { PageRange } from "./types";
import { sanitizePageCount } from "./utils";

type Props = {
  visible: boolean;
  value: PageRange;
  onApply: (value: PageRange) => void;
  onReset: () => void;
  onClose: () => void;
};

export default function PageRangeModal({
  visible,
  value,
  onApply,
  onReset,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<PageRange>(value);

  useEffect(() => {
    if (visible) {
      setDraft(value);
    }
  }, [value, visible]);

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
              <Text style={styles.filterSheetTitle}>분량</Text>

              <View style={styles.rangeBlock}>
                <Text style={styles.rangeLabel}>쪽수 범위</Text>
                <View style={styles.pageInputRow}>
                  <TextInput
                    value={draft.min}
                    onChangeText={(text) =>
                      setDraft((prev) => ({
                        ...prev,
                        min: sanitizePageCount(text),
                      }))
                    }
                    placeholder="0"
                    placeholderTextColor="#CBBCA2"
                    keyboardType="number-pad"
                    maxLength={4}
                    style={styles.pageInput}
                  />
                  <Text style={styles.rangeUnit}>쪽</Text>
                  <Text style={styles.pageRangeSymbol}>~</Text>
                  <TextInput
                    value={draft.max}
                    onChangeText={(text) =>
                      setDraft((prev) => ({
                        ...prev,
                        max: sanitizePageCount(text),
                      }))
                    }
                    placeholder="2000"
                    placeholderTextColor="#CBBCA2"
                    keyboardType="number-pad"
                    maxLength={4}
                    style={styles.pageInput}
                  />
                  <Text style={styles.rangeUnit}>쪽</Text>
                </View>
              </View>

              <ModalActionRow
                onReset={onReset}
                onApply={() => onApply(draft)}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
