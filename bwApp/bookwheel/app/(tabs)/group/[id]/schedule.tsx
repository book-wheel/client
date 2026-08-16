import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { getGroupSchedule } from "@/api/group-dashboard";

type Round = {
  roundNumber: number;
  startDate: string;
  endDate: string;
  executable: boolean;
  wheelStateId: string;
  wheelStatus: string;
  bookId: string;
  bookTitle: string;
  coverImage: string;
  senderNickname: string;
};

type Schedule = {
  startDate: string;
  endDate: string | null;
  readingPeriod: number;
  currentMemberCount: number;
  targetMemberCount: number | null;
  scheduleStatus: string;
  rounds: Round[];
};

export default function Schedule() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchSchedule = async () => {
      try {
        const data = await getGroupSchedule(id);

        console.log("생성된 일정:", data);

        setSchedule(data);
      } catch (error) {
        console.error("일정 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  const handleMemberOrder = () => {
    router.push({
      pathname: "/group/[id]/member-order-edit",
      params: { id },
    });
  };

  const handleBookRegister = () => {
    router.push({
      pathname: "/group/[id]/add-book",
      params: { id },
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF",
        }}
      >
        <Text style={{ color: "#888" }}>독서 일정을 불러오는 중...</Text>
      </View>
    );
  }

  if (!schedule) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF",
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#513A11",
          }}
        >
          일정을 불러오지 못했어요.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 28,
          paddingBottom: 180,
        }}
      >
        {/* 헤더 */}
        <View style={{ paddingHorizontal: 4 }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "700",
              color: "#513A11",
            }}
          >
            독서 일정
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#888",
              lineHeight: 21,
            }}
          >
            멤버들의 읽기 순서에 따라
            {"\n"}
            독서 일정이 만들어졌어요.
          </Text>
        </View>

        {/* 일정 요약 */}
        <View
          style={{
            marginTop: 22,
            padding: 20,
            borderRadius: 18,
            backgroundColor: "#FFF8E8",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <Ionicons name="calendar-outline" size={21} color="#B8873D" />

            <Text
              style={{
                marginLeft: 8,
                fontSize: 17,
                fontWeight: "700",
                color: "#513A11",
              }}
            >
              일정 요약
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SummaryItem
              label="시작일"
              value={formatDate(schedule.startDate)}
            />

            <SummaryItem
              label="독서 기간"
              value={`${schedule.readingPeriod}일`}
            />

            <SummaryItem
              label="참여자"
              value={`${schedule.currentMemberCount}명`}
            />
          </View>
        </View>

        {/* 라운드 */}
        <View style={{ marginTop: 28 }}>
          <Text
            style={{
              fontSize: 19,
              fontWeight: "700",
              color: "#513A11",
              marginBottom: 14,
            }}
          >
            읽기 일정
          </Text>

          {schedule.rounds.map((round) => (
            <View
              key={round.roundNumber}
              style={{
                marginBottom: 14,
                padding: 18,
                borderRadius: 18,
                backgroundColor: "#FFF",
                borderWidth: 1,
                borderColor: "#F0E5D2",
              }}
            >
              {/* 라운드 헤더 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#FFF3D8",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#B8873D",
                      }}
                    >
                      {round.roundNumber}
                    </Text>
                  </View>

                  <Text
                    style={{
                      marginLeft: 9,
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#513A11",
                    }}
                  >
                    라운드
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 13,
                    color: "#8B6D3A",
                  }}
                >
                  {formatDate(round.startDate)} ~ {formatDate(round.endDate)}
                </Text>
              </View>

              {/* 책 */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 18,
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    round.coverImage
                      ? { uri: round.coverImage }
                      : require("@/assets/images/logo.png")
                  }
                  style={{
                    width: 64,
                    height: 88,
                    borderRadius: 8,
                    backgroundColor: "#F3F3F3",
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 14,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#513A11",
                      lineHeight: 23,
                    }}
                  >
                    {round.bookTitle}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 9,
                    }}
                  >
                    <Ionicons name="person-outline" size={15} color="#A68D63" />

                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 13,
                        color: "#8B6D3A",
                      }}
                    >
                      {round.senderNickname}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
          backgroundColor: "#FFF",
          borderTopWidth: 1,
          borderTopColor: "#F4EFE7",
        }}
      >
        <TouchableOpacity
          onPress={handleBookRegister}
          activeOpacity={0.8}
          style={{
            height: 48,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFF8E8",
            borderWidth: 1,
            borderColor: "#EFDDBD",
            marginBottom: 9,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="book-outline" size={18} color="#B8873D" />

            <Text
              style={{
                marginLeft: 7,
                color: "#B8873D",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              도서 다시 등록하기
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleMemberOrder}
          activeOpacity={0.8}
          style={{
            height: 48,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFF8E8",
            borderWidth: 1,
            borderColor: "#EFDDBD",
            marginBottom: 9,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="swap-vertical-outline" size={19} color="#B8873D" />

            <Text
              style={{
                marginLeft: 7,
                color: "#B8873D",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              읽기 순서 다시 지정
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            height: 54,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#E4A54E",
          }}
          onPress={() =>
            router.replace({
              pathname: "/group/[id]/add-book",
              params: { id },
            })
          }
        >
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            일정 확인 완료
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 12,
          color: "#A68D63",
          marginBottom: 5,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: "#513A11",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function formatDate(date: string | null) {
  if (!date) return "-";

  const [year, month, day] = date.split("-");

  return `${year}.${month}.${day}`;
}
