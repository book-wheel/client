import { View, Text, ScrollView, Dimensions, Pressable } from "react-native";
import { router } from "expo-router";
import ReadingCard from "@/components/home/ReadingCard";
import type { CurrentReadingBookContent } from "@/types/books";

const { width } = Dimensions.get("window");

type Props = {
  rooms: CurrentReadingBookContent[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

const getReadingStatusLabel = (room: CurrentReadingBookContent) => {
  if (!room.upcoming) {
    return "현재 읽는 중";
  }

  if (room.dday === 0) {
    return "D-Day · 아직 시작 전";
  }

  return room.dday == null ? "시작 전" : `D-${room.dday} · 시작 전`;
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
              <ReadingCard
                image={
                  room.coverImageUrl
                    ? { uri: room.coverImageUrl }
                    : require("@/assets/images/book.png")
                }
                title={room.title}
                titleOnly
                statusLabel={getReadingStatusLabel(room)}
              />
            </Pressable>
          ))
        ) : (
          <View style={{ width, paddingHorizontal: 20, paddingVertical: 36 }}>
            <Text style={{ color: "#7B6A4A" }}>
              현재 읽거나 시작 예정인 책이 없어요.
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
