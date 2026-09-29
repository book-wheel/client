import ErrorNotice from "@/components/ErrorNotice";
import { ScrollView, View, Text } from "react-native";
import Greeting from "@/components/home/Greeting";
import ActiveRoomsCarousel from "@/components/home/ActiveRoomsCarousel";
import MyGroupsSection from "@/components/home/MyGroupsSection";
import { useHome } from "@/hooks/useHome";

export default function Index() {
  const { nickname, rooms, myGroups, currentIndex, setCurrentIndex, isLoading, error, retry } =
    useHome();

  return (
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
          <ErrorNotice message={error} onRetry={retry} />
        ) : null}

        {!isLoading && !error ? (
          <>
            <Greeting nickname={nickname} />
            <ActiveRoomsCarousel
              rooms={rooms}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
            <MyGroupsSection groups={myGroups} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
