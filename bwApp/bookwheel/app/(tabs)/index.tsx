import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { ScrollView, Dimensions } from "react-native";
import ReadingCard from "@/components/home/ReadingCard";
import MyGroupCard from "@/components/home/MyGroupCard";
const { width } = Dimensions.get("window");

export default function Index() {
  const [nickname, setNickname] = React.useState("문소희");

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const rooms = [
    {
      name: "교환독서방",
      round: 3,
      dDay: 4,
      book: "괴테는 모든 것을 말했다",
      author: "소피의 일기",
      owner: "조혜연",
    },
    {
      name: "문장수집가들",
      round: 1,
      dDay: 10,
      book: "어린왕자",
      author: "생텍쥐페리",
      owner: "김민지",
    },
    {
      name: "북클럽",
      round: 5,
      dDay: 2,
      book: "불편한 편의점",
      author: "김호연",
      owner: "이서연",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* 로고 */}
              <Image
                source={require("@/assets/images/logo-clear.png")}
                style={{ width: 35, height: 35, marginRight: 6 }}
                resizeMode="contain"
              />

              {/* 타이틀 */}
              <Text
                style={{ color: "#513A11", fontSize: 23, fontWeight: "bold" }}
              >
                책바퀴
              </Text>
            </View>
          ),
          headerRight: () => (
            // 알림 아이콘
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              style={{ marginRight: 25 }}
            >
              <Ionicons
                name="notifications-outline"
                size={25}
                color="#513A11"
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* 본격 화면------------------------------------------------------------------- */}

      <ScrollView
        contentContainerStyle={{
          // alignItems: "center",
          paddingBottom: 40,
          backgroundColor: "#FFF",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, paddingTop: 40 }}>
          {/* 인사말 */}
          <View
            style={{
              width: "100%",
              paddingHorizontal: 20,
              alignItems: "flex-start",
            }}
          >
            <Text style={styles.greeting}>
              안녕하세요, <Text style={styles.name}>{nickname}</Text> 님!
              {"\n"}
              오늘도 함께해요!
            </Text>
          </View>

          {/* 진행중인 독서모임 */}
          <View
            style={{
              width: "100%",
              borderTopColor: "#513A11",
              borderTopWidth: 0.3,
              marginTop: 20,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                paddingTop: 20,
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-start",
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
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {rooms.map((room, idx) => (
              <View key={idx} style={{ width }}>
                <Text
                  style={{
                    alignSelf: "flex-start",
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
                />
              </View>
            ))}
          </ScrollView>

          {/* 페이지 인디케이터 */}
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

          {/* 내 모임 */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              borderTopColor: "#513A11",
              borderTopWidth: 0.3,
              marginTop: 20,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: "bold",
                  color: "#513A11",
                }}
              >
                내 모임
              </Text>

              {/* (그룹) 전체보기 */}
              <TouchableOpacity onPress={() => router.push("/(tabs)/groups")}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#999",
                  }}
                >
                  전체보기
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 15,
              marginTop: 20,
            }}
          >
            <MyGroupCard
              dday={5}
              name="책바퀴"
              memberCount="8/8"
              type="오프라인"
              regen="천안"
              info="각자 읽고 느낀 점을 자유롭게 공유하는 모임입니다."
            />

            <MyGroupCard
              dday={5}
              name="책바퀴"
              memberCount="4/6"
              type="온라인"
              regen=""
              info="각자 읽고 느낀 점을 자유롭게 공유하는 모임입니다."
            />
            <MyGroupCard
              dday={5}
              name="책바퀴"
              memberCount="4/6"
              type="온라인"
              regen=""
              info="각자 읽고 느낀 점을 자유롭게 공유하는 모임입니다."
            />
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}

const styles = {
  greeting: {
    fontSize: 19,
    color: "#513A11",
    lineHeight: 26,
    marginBottom: 20,
  },
  name: {
    fontWeight: "bold" as const,
    color: "#E4A54E",
  },
};
