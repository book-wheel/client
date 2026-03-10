import { View, Text } from "react-native";

export default function Greeting({ nickname }: { nickname: string }) {
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 20,
        alignItems: "flex-start",
      }}
    >
      <Text
        style={{
          fontSize: 19,
          color: "#513A11",
          lineHeight: 26,
          marginBottom: 20,
        }}
      >
        안녕하세요,{" "}
        <Text style={{ fontWeight: "bold", color: "#E4A54E" }}>{nickname}</Text>{" "}
        님!{"\n"}오늘도 함께해요!
      </Text>
    </View>
  );
}
