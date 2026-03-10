import { View, Text, TouchableOpacity } from "react-native";
import styles from "@/styles/completedBooks.style";

export default function PhotoUpload() {
  return (
    <View style={styles.sectionBox}>
      <Text style={styles.sectionTitle}>인증 사진 업로드 (5개 이하)</Text>

      <TouchableOpacity style={styles.uploadBox}>
        <Text style={{ fontSize: 40, color: "#ccc" }}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}
