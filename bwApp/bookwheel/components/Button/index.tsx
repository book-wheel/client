import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
}

export default function Button({ title, onPress, color }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, color ? { backgroundColor: color } : {}]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 30,
    backgroundColor: "#E4A54E",
    width: 317,
    alignItems: "center",
    borderColor: "#513A11",
    borderWidth: 1,
  },
  text: {
    color: "#513A11",
    fontSize: 16,
    fontWeight: "bold",
  },
});
