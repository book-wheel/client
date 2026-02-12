import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";

type SocialType = "google" | "kakao";

type Props = {
  type: SocialType;
  onPress: () => void;
};

export default function SocialButton({ type, onPress }: Props) {
  const isGoogle = type === "google";
  const isKakao = type === "kakao";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.inner}>
        <Image
          source={
            isGoogle
              ? require("@/assets/images/google.png")
              : require("@/assets/images/kakao.png")
          }
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 12,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
