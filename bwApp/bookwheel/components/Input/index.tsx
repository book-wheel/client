import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from "react-native";

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  error?: string;
  rightButton?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  };
  editable?: boolean;
  style?: TextStyle;
};

export default function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  rightButton,
  editable = true,
  style,
}: InputProps) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputBox, error && styles.errorInput]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          placeholderTextColor="#aaa"
          style={[styles.input, style, !editable && { color: "#513A11" }]}
        />

        {rightButton && (
          <TouchableOpacity
            onPress={rightButton.onPress}
            disabled={rightButton.disabled}
            activeOpacity={rightButton.disabled ? 1 : 0.7}
          >
            <Text
              style={[
                styles.rightText,
                rightButton.disabled && { color: "#aaa" },
              ]}
            >
              {rightButton.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },

  inputBox: {
    width: 317,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#513A11",
    borderRadius: 30,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#513A11",
  },

  rightText: {
    color: "#E4A54E",
    fontSize: 12,
  },

  errorInput: {
    borderColor: "red",
  },

  errorText: {
    marginTop: 6,
    fontSize: 11,
    color: "red",
    marginLeft: 8,
  },
});
