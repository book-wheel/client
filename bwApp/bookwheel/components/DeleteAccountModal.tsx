import {
  ActivityIndicator,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

type Props = {
  visible: boolean;
  password: string;
  requiresPassword: boolean;
  loading?: boolean;
  errorMessage?: string;
  onChangePassword: (v: string) => void;
  onForgotPassword?: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteAccountModal({
  visible,
  password,
  requiresPassword,
  loading = false,
  errorMessage,
  onChangePassword,
  onForgotPassword,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
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
            {requiresPassword
              ? "비밀번호를 입력한 뒤 탈퇴를 진행할 수 있어요."
              : "소셜 계정은 비밀번호 확인 없이 탈퇴를 진행할 수 있어요."}
          </Text>

          {requiresPassword && (
            <>
              <TextInput
                value={password}
                onChangeText={onChangePassword}
                placeholder="비밀번호"
                secureTextEntry
                editable={!loading}
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                }}
              />
              <TouchableOpacity
                onPress={onForgotPassword}
                disabled={loading}
                style={{ alignSelf: "flex-end", marginBottom: 14 }}
              >
                <Text style={{ color: "#E4A54E", fontSize: 12 }}>
                  비밀번호를 잊으셨나요?
                </Text>
              </TouchableOpacity>
            </>
          )}

          {errorMessage && (
            <Text style={{ color: "#C65B5B", fontSize: 13, marginBottom: 14 }}>
              {errorMessage}
            </Text>
          )}

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
              disabled={loading}
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
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600" }}>탈퇴</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
