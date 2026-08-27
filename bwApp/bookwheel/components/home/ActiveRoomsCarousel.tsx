import { View, Text, ScrollView, Dimensions, Pressable } from "react-native";
import { router } from "expo-router";
import ReadingGroupCard from "@/components/home/ReadingGroupCard";
import type { HomeReadingRoom } from "@/types/room"; // 홈 카드 전용 타입 추가

const { width } = Dimensions.get("window");

type Props = {
  rooms: HomeReadingRoom[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

const formatDDay = (dDay: number | null) => {
  if (dDay == null) return "종료일 확인 중";
  if (dDay === 0) return "D-Day";
  if (dDay < 0) return `D+${Math.abs(dDay)}`;
  return `D-${dDay}`;
};

const getReadingStatusLabel = (room: HomeReadingRoom) => {
  if (room.status === "reschedule_required") {
    return "일정 재설정 필요";
  }

  if (room.status === "scheduled") {
    return room.dDay == null
      ? "시작일 미정"
      : `${formatDDay(room.dDay)} · 시작 예정`;
  }

  return `${room.currentRound}회차 · ${formatDDay(room.dDay)}`;
};

export default function ActiveRoomsCarousel({
  rooms,
  currentIndex,
  setCurrentIndex,
}: Props) {
  return (
    <>
      {/* 섹션 제목 */}
      <View
        style={{
          width: "100%",
          borderTopColor: "#513A11",
          borderTopWidth: 0.3,
          marginTop: 20,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
            fontSize: 23,
            fontWeight: "bold",
            color: "#513A11",
          }}
        >
          현재·예정 교환 독서 모임
        </Text>
      </View>

      {/* 캐러셀 */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Pressable
              key={room.groupId}
              style={{ width }}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/group/[id]/(top)/home",
                  params: { id: room.groupId },
                })
              }
            >
              <ReadingGroupCard
                room={room}
                statusLabel={getReadingStatusLabel(room)}
              />
            </Pressable>
          ))
        ) : (
          <View style={{ width, paddingHorizontal: 20, paddingVertical: 36 }}>
            <Text style={{ color: "#7B6A4A" }}>
              현재 또는 시작 예정인 모임이 없어요.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 인디케이터 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {rooms.map((_, i) => (
          <View
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: 4,
              marginHorizontal: 4,
              backgroundColor: i === currentIndex ? "#E4A54E" : "#DDD",
            }}
          />
        ))}
      </View>
    </>
  );
}
