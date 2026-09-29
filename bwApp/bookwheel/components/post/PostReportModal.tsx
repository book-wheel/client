import type { PostReportReason } from "@/types/posts";
import { useRef, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { reportPost } from "@/api/posts";
import { showApiError } from "@/api/axios";

const reasons: { value: PostReportReason; label: string }[] = [
  { value: "SPAM", label: "스팸 및 광고" },
  { value: "ABUSE", label: "욕설 및 괴롭힘" },
  { value: "PORNOGRAPHY", label: "음란물" },
  { value: "COPYRIGHT", label: "저작권 침해" },
  { value: "OTHER", label: "기타" },
];

type Props = { postId: number; onClose: () => void; onSuccess: () => void };

export default function PostReportModal({ postId, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState<PostReportReason | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  const submit = async () => {
    if (!reason || inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    try {
      await reportPost(postId, reason);
      onSuccess();
    } catch (error) {
      showApiError(error, "신고를 접수하지 못했습니다. 다시 시도해주세요.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={() => { if (!inFlight.current) onClose(); }}>
      <View style={styles.overlay}>
        <View style={styles.dialog} accessibilityViewIsModal>
          <Text style={styles.title}>게시물 신고</Text>
          <Text style={styles.description}>신고 사유를 선택해주세요.</Text>
          {reasons.map((item) => (
            <Pressable key={item.value} accessibilityRole="radio" accessibilityState={{ checked: reason === item.value, disabled: submitting }} disabled={submitting} onPress={() => setReason(item.value)} style={[styles.option, reason === item.value && styles.selected]}>
              <Text style={styles.text}>{reason === item.value ? "●" : "○"}  {item.label}</Text>
            </Pressable>
          ))}
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" disabled={submitting} onPress={onClose} style={styles.button}><Text style={styles.text}>취소</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={submitting ? "신고 접수 중" : "신고하기"} accessibilityState={{ disabled: !reason || submitting }} disabled={!reason || submitting} onPress={() => void submit()} style={[styles.button, styles.submit, (!reason || submitting) && styles.disabled]}>
              {submitting ? <ActivityIndicator color="#513A11" /> : <Text style={styles.text}>신고하기</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: 24 },
  dialog: { width: "100%", maxWidth: 400, borderRadius: 16, backgroundColor: "#FFFFFF", padding: 24, gap: 10 },
  title: { fontSize: 20, fontWeight: "700", color: "#333333" },
  description: { color: "#666666", marginBottom: 8 },
  text: { fontSize: 16, color: "#513A11" },
  option: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#EEEEEE" },
  selected: { backgroundColor: "#FCF5D7", borderColor: "#E4A54E" },
  actions: { flexDirection: "row", gap: 12, marginTop: 12 },
  button: { flex: 1, alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 8 },
  submit: { backgroundColor: "#FCF5D7" },
  disabled: { opacity: 0.5 },
});
