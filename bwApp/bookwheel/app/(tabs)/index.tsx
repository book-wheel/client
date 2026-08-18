import { ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";
import HomeHeader from "@/components/home/HomeHeader";
import Greeting from "@/components/home/Greeting";
import ActiveRoomsCarousel from "@/components/home/ActiveRoomsCarousel";
import MyGroupsSection from "@/components/home/MyGroupsSection";
import { useHome } from "@/hooks/useHome";

export default function Index() {
  const { nickname, rooms, myGroups, currentIndex, setCurrentIndex, isLoading, error } =
      useHome();

  return (
    <>
      <Stack screenOptions={HomeHeader} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          backgroundColor: "#FFF",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, paddingTop: 40 }}>
          {isLoading ? (
            <Text style={{ color: "#7B6A4A", paddingHorizontal: 20 }}>
              홈 화면을 불러오는 중이에요.
            </Text>
          ) : null}

          {error ? (
            <Text style={{ color: "#B44A3C", paddingHorizontal: 20 }}>
              {error}
            </Text>
          ) : null}

          <Greeting nickname={nickname} />

          <ActiveRoomsCarousel
            rooms={rooms}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />

          <MyGroupsSection groups={myGroups} />
        </View>
      </ScrollView>
    </>
  );
}
