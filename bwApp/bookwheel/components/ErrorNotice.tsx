import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorNotice({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="alert" style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity accessibilityRole="button" onPress={onRetry} style={styles.retry}>
          <Text style={styles.message}>다시 시도</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", gap: 12 },
  message: { color: "#513A11", textAlign: "center" },
  retry: { padding: 12, borderRadius: 8, backgroundColor: "#FCF5D7" },
});
