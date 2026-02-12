import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

type Props = {
  children: React.ReactNode;
};

export default function AuthCard({ children }: Props) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    bottom: 0,
    width: width,
    minHeight: height * 0.75, // 최소 높이

    backgroundColor: "#fff",
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,

    paddingHorizontal: 28,
    paddingTop: 55,
    paddingBottom: 40,
    alignItems: "center",
  },
});
