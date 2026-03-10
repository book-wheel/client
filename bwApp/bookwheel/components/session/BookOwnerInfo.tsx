import { View, Text } from "react-native";
import Profile from "@/components/profile/image";

type Props = {
  name: string;
  comment: string;
  details?: string;
};

export default function BookOwnerInfo({ name, comment, details }: Props) {
  return (
    <View
      style={{
        marginTop: 40,
        width: "100%",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "500", color: "#513A11" }}>
        책 주인
      </Text>

      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Profile size={32} showCamera={false} />

        <Text
          style={{
            fontSize: 14,
            marginLeft: 8,
            color: "#513A11",
          }}
        >
          {name}
        </Text>
      </View>

      <View
        style={{
          width: "90%",
          backgroundColor: "#EFEDE9",
          padding: 15,
          borderRadius: 10,
        }}
      >
        {comment.split("\n").map((line, index) => (
          <Text
            key={index}
            style={{
              fontSize: 14,
              color: "#555",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            {line}
          </Text>
        ))}
      </View>

      <View
        style={{
          marginTop: 12,
          paddingVertical: 6,
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ fontSize: 12, color: "#444" }}>
          책 상태: {details ?? "상태 정보 없음"}
        </Text>
      </View>
    </View>
  );
}
