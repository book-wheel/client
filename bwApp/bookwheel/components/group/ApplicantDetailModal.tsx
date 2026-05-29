import { Modal, View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Applicant } from "@/hooks/useGroupHome";

type Props = {
  visible: boolean;
  applicant: Applicant | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export default function ApplicantDetailModal({
  visible,
  applicant,
  onClose,
  onApprove,
  onReject,
}: Props) {
  if (!applicant) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          {/* 핸들 */}
          <View style={styles.handle} />

          {/* 프로필 영역 */}
          <View style={styles.profileSection}>
            <Image
              source={{
                uri:
                  applicant.profileImageUrl ||
                  "https://via.placeholder.com/100",
              }}
              style={styles.profileImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{applicant.name}</Text>

              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>{applicant.requestDate}</Text>
              </View>
            </View>
          </View>

          {/* 메시지 카드 */}
          <View style={styles.messageCard}>
            <Text style={styles.messageLabel}>가입 메시지</Text>

            <Text style={styles.message}>
              {applicant.joinMent || "메시지가 없습니다."}
            </Text>
          </View>

          {/* 버튼 */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.rejectBtn} onPress={onReject}>
              <Text style={styles.rejectText}>거절</Text>
            </Pressable>

            <Pressable style={styles.approveBtn} onPress={onApprove}>
              <Text style={styles.approveText}>수락</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 34,
  },

  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginBottom: 24,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginRight: 14,
    backgroundColor: "#EEE",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#513A11",
    marginBottom: 8,
  },

  dateBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF5E3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  dateText: {
    fontSize: 12,
    color: "#C48A36",
    fontWeight: "600",
  },

  messageCard: {
    backgroundColor: "#FFF9F0",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },

  messageLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B08B57",
    marginBottom: 10,
  },

  message: {
    fontSize: 15,
    color: "#513A11",
    lineHeight: 24,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  approveBtn: {
    flex: 1,
    backgroundColor: "#E4A54E",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  rejectText: {
    color: "#666",
    fontWeight: "700",
    fontSize: 15,
  },

  approveText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
