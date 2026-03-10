import { View, Text } from "react-native";

type Props = {
  intro: string;
  rules: string[];
};

export default function GroupIntro({ intro, rules }: Props) {
  return (
    <>
      {/* 소개 */}
      <View style={{ alignItems: "center", marginTop: 54 }}>
        <View
          style={{
            backgroundColor: "#FFFCF3",
            borderRadius: 5,
            padding: 20,
            width: 337,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#513A11", fontWeight: "bold", fontSize: 15 }}>
            {intro}
          </Text>
        </View>
      </View>

      {/* 규칙 */}
      <View style={{ width: "100%", marginTop: 40 }}>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 26,
            marginBottom: 16,
            fontWeight: "bold",
            color: "#513A11",
          }}
        >
          모임 규칙
        </Text>

        {rules.map((rule, index) => (
          <Text key={index} style={{ marginLeft: 26, color: "#513A11" }}>
            {index + 1}. {rule}
          </Text>
        ))}
      </View>
    </>
  );
}
