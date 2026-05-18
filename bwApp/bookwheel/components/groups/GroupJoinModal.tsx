import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { joinGroup } from "@/api/group";

import { ExtendedGroup } from "./GroupListExtended";
import { useState } from "react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;

  step: 1 | 2;
  setStep: (v: 1 | 2) => void;

  selectedGroup: ExtendedGroup | null;

  setJoinedIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function GroupJoinModal({
  open,
  setOpen,
  step,
  setStep,
  selectedGroup,
  setJoinedIds,
}: Props) {
  const [password, setPassword] = useState("");
  const [joinMent, setJoinMent] = useState("");

  const handleClose = () => {
    setPassword("");
    setJoinMent("");
    setStep(1);
    setOpen(false);
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => handleClose()}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {step === 1 && (
                <>
                  <Text style={styles.title}>{selectedGroup?.title}</Text>

                  <Text style={styles.subtitle}>비밀번호를 입력해주세요</Text>

                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor="#CCC"
                    value={password}
                    onChangeText={setPassword}
                  />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.btn, styles.cancel]}
                      onPress={() => handleClose()}
                    >
                      <Text style={styles.cancelText}>취소</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btn, styles.apply]}
                      onPress={() => setStep(2)}
                    >
                      <Text style={styles.applyText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={styles.title}>{selectedGroup?.title}</Text>

                  <Text style={styles.subtitle}>가입메시지를 입력해주세요</Text>

                  <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="입력하시길 바랍니다"
                    placeholderTextColor="#CCC"
                    multiline
                    textAlignVertical="top"
                    value={joinMent}
                    onChangeText={setJoinMent}
                  />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.btn, styles.cancel]}
                      onPress={() => handleClose()}
                    >
                      <Text style={styles.cancelText}>취소</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btn, styles.apply]}
                      onPress={async () => {
                        if (!selectedGroup) return;

                        try {
                          console.log(selectedGroup.id);
                          console.log(selectedGroup.title);

                          await joinGroup(selectedGroup.id, {
                            password: selectedGroup?.isPrivate
                              ? password
                              : undefined,
                            joinMent,
                          });

                          setJoinedIds((prev) => [...prev, selectedGroup.id]);

                          handleClose();
                        } catch (error: any) {
                          const message =
                            error.response?.data?.error?.message ||
                            "가입 요청에 실패했습니다.";

                          Alert.alert("오류", message);

                          handleClose();
                        }
                      }}
                    >
                      <Text style={styles.applyText}>가입</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
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
    backgroundColor: "#0005",
    justifyContent: "center",
    alignItems: "center",
  },

  sheet: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },

  subtitle: {
    fontSize: 13,
    color: "#999",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },

  textarea: {
    height: 110,
    paddingTop: 12,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    width: "100%",
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancel: {
    backgroundColor: "#F0F0F0",
  },

  apply: {
    backgroundColor: "#E4A54E",
  },

  cancelText: {
    color: "#888",
    fontWeight: "600",
  },

  applyText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
