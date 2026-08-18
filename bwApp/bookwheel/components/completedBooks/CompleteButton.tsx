import { Text, TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export default function CompleteButton({ onPress, disabled = false }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={{
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: disabled ? "#E8E3D8" : "#E4A54E",
      }}
    >
      <Text
        style={{
          color: disabled ? "#A99F8C" : "#FFF",
          fontSize: 15,
          fontWeight: "700",
        }}
      >
        {disabled ? "완독 인증 중..." : "완독 인증하기"}
      </Text>
    </TouchableOpacity>
  );
}
