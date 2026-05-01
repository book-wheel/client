import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";

type Props = {
  visible: boolean;
  password: string;
  onChangePassword: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteAccountModal({
  visible,
  password,
  onChangePassword,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
            회원탈퇴
          </Text>

          <Text style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>
            비밀번호를 입력하면 탈퇴가 진행돼요
          </Text>

          <TextInput
            value={password}
            onChangeText={onChangePassword}
            placeholder="비밀번호"
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 12,
              marginBottom: 20,
            }}
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 14,
                backgroundColor: "#eee",
                borderRadius: 10,
                alignItems: "center",
              }}
              onPress={onClose}
            >
              <Text>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                padding: 14,
                backgroundColor: "#E4A54E",
                borderRadius: 10,
                alignItems: "center",
              }}
              onPress={onConfirm}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>탈퇴</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
