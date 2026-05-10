import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  actionText?: string;
  onPressAction?: () => void;
};

export default function BooksSectionHeader({
  title,
  actionText,
  onPressAction,
}: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {actionText && onPressAction && (
        <TouchableOpacity onPress={onPressAction} activeOpacity={0.7}>
          <Text style={styles.action}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 28,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#513A11",
    fontSize: 24,
    fontWeight: "800",
  },
  action: {
    color: "#A68D63",
    fontSize: 15,
    fontWeight: "600",
  },
});
