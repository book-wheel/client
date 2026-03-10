import { View, Text, Image } from "react-native";

export default function SessionBook() {
  return (
    <>
      <Text style={{ fontSize: 20, fontWeight: "600", color: "#513A11" }}>
        이번 회차에서 읽을 책
      </Text>

      <Image
        source={require("@/assets/images/book.png")}
        style={{
          width: 180,
          height: 240,
          marginTop: 30,
          borderRadius: 12,
        }}
        resizeMode="cover"
      />
    </>
  );
}
