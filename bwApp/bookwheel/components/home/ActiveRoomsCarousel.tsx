import { View, Text, ScrollView, Dimensions } from "react-native";
import { router } from "expo-router";
import ReadingCard from "@/components/home/ReadingCard";
import { Room } from "@/types/room";

const { width } = Dimensions.get("window");

type Props = {
  rooms: Room[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
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
          현재 진행중인 교환 독서 모임
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
        {rooms.map((room) => (
          <View key={room.id} style={{ width }}>
            <Text
              style={{
                paddingHorizontal: 20,
                marginTop: 20,
                fontSize: 17,
                color: "#513A11",
              }}
            >
              {`<${room.name}> · ${room.round}회차 진행중 `}
              <Text style={{ color: "#E4A54E", fontWeight: "bold" }}>
                {`( D-${room.dDay} )`}
              </Text>
            </Text>

            <ReadingCard
              image={require("@/assets/images/book.png")}
              title={room.book}
              author={room.author}
              owner={room.owner}
              onPress={() =>
                router.push({
                  pathname: "/group/[id]/state",
                  params: { id: room.id },
                })
              }
            />
          </View>
        ))}
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
