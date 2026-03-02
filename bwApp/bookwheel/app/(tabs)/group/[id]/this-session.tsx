import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import Profile from "@/components/profile/image";
import Button from "@/components/Button";

export default function ThisSession() {
  const groupId = "1";

  const bookOwner = {
    name: "김주옥",
    comment: "차갑지만 묘하게 따뜻한 이야기예요\n재밌게 읽어주세요!",
    details: "21페이지 찢김",
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F8F5EC",
        padding: 20,
        justifyContent: "space-between",
      }}
    >
      {/* 상단 콘텐츠 */}
      <View style={{ alignItems: "center", marginTop: 30 }}>
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

        {/* 책 주인 영역 */}
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
              {bookOwner.name}
            </Text>
          </View>

          {/* 코멘트 박스 */}
          <View
            style={{
              width: "90%",
              backgroundColor: "#EFEDE9",
              padding: 15,
              borderRadius: 10,
            }}
          >
            {bookOwner.comment.split("\n").map((line, index) => (
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

          {/* 책 상태 */}
          <View
            style={{
              marginTop: 12,
              paddingVertical: 6,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontSize: 12, color: "#444" }}>
              책 상태: {bookOwner.details ?? "상태 정보 없음"}
            </Text>
          </View>
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={{ width: "100%", alignItems: "center" }}>
        <Button
          title="독서 시작하기"
          onPress={() =>
            router.replace({
              pathname: "/group/[id]/state",
              params: { id: groupId },
            })
          }
        />
      </View>
    </View>
  );
}
