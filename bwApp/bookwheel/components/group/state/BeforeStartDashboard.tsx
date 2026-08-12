import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/build/Ionicons";

type Props = {
  id: string;
  dDay?: number;
  startDate?: string;
  hasBook?: boolean;
  bookTitle?: string;
  author?: string;
  coverImage?: string;
  canSetMemberOrder?: boolean;
};

export default function BeforeStartDashboard({
  id,
  dDay,
  startDate,
  hasBook = false,
  bookTitle,
  author,
  coverImage,
  canSetMemberOrder = false,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        paddingHorizontal: 24,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          marginTop: 90,
        }}
      >
        {hasBook ? (
          // 등록 후
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 24,
              padding: 24,
              marginBottom: 40,
            }}
          >
            {/* 시작 예정일 */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="calendar-outline" size={18} color="#A68D63" />

              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 18,
                  color: "#8B6D3A",
                  fontWeight: "500",
                }}
              >
                {formatStartDate(startDate)}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "#E9D8B5",
                marginVertical: 24,
                marginBottom: 60,
              }}
            />

            {/* 제목 */}
            <View>
              <Text
                style={{
                  fontSize: 13,
                  color: "#8B6D3A",
                  marginBottom: 15,
                }}
              >
                내가 등록한 책
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    coverImage
                      ? { uri: coverImage }
                      : require("@/assets/images/book.png")
                  }
                  style={{
                    width: 75,
                    height: 110,
                    borderRadius: 5,
                  }}
                  resizeMode="cover"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 16,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#513A11",
                    }}
                  >
                    {bookTitle}
                  </Text>

                  <Text
                    style={{
                      marginTop: 7,
                      color: "#888",
                      fontSize: 14,
                    }}
                  >
                    {author}
                  </Text>
                </View>
              </View>

              {/* 버튼 */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/search",
                    params: {
                      from: "add",
                      id,
                    },
                  })
                }
                style={{
                  marginTop: 20,
                  height: 52,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFF8E8",
                }}
              >
                <Text
                  style={{
                    color: "#B8873D",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  다른 책으로 변경하기
                </Text>
              </TouchableOpacity>

              {canSetMemberOrder && (
                <TouchableOpacity
                  onPress={() => {
                    console.log("이동:", id);

                    router.push({
                      pathname: "/group/[id]/member-order-edit",
                      params: {
                        id: String(id),
                      },
                    });
                  }}
                  style={{
                    marginTop: 12,
                    height: 52,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#E4A54E",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    읽기 순서 지정하기
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <>
            {/* D-Day 카드 */}
            <View
              style={{
                backgroundColor: "#FFF8E8",
                borderRadius: 20,
                paddingVertical: 30,
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#8B6D3A",
                  fontWeight: "600",
                }}
              >
                독서 릴레이 시작까지
              </Text>

              <Text
                style={{
                  fontSize: 40,
                  color: "#513A11",
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                {typeof dDay === "number" ? `D-${dDay}` : "시작일 미정"}
              </Text>
            </View>

            {/* 책 등록 버튼 */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: {
                    from: "add",
                    id,
                  },
                })
              }
              style={{
                backgroundColor: "#E4A54E",
                borderRadius: 15,
                paddingVertical: 18,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                책 등록하기
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {/* 하단 안내 */}
      <View
        style={{
          marginBottom: 40,
          backgroundColor: "#FAFAFA",
          borderRadius: 18,
          padding: 18,
        }}
      >
        <Text
          style={{
            color: "#A0A0A0",
            lineHeight: 22,
            fontSize: 13,
          }}
        >
          • 시작 전까지 원하는 책을 자유롭게 등록할 수 있어요.
          {"\n"}• 독서 릴레이가 시작되면 책 정보는 변경할 수 없어요.
          {"\n"}• 읽을 사람이 정해지면 해당 멤버에게 책을 전달하게 돼요.
          {"\n"}• 책 상태와 남긴 메모는 다음 독자에게 함께 전달돼요.
        </Text>
      </View>
    </View>
  );
}

function formatStartDate(startDate?: string) {
  if (!startDate) return "진행 예정일 미정";

  const [year, month, day] = startDate.split("T")[0].split("-").map(Number);

  if (!year || !month || !day) return "진행 예정일 미정";

  return `${year}년 ${month}월 ${day}일 진행 예정`;
}
