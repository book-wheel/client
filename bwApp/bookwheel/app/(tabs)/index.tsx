import { ScrollView, View } from "react-native";
import Greeting from "@/components/home/Greeting";
import ActiveRoomsCarousel from "@/components/home/ActiveRoomsCarousel";
import MyGroupsSection from "@/components/home/MyGroupsSection";
import { useHome } from "@/hooks/useHome";

export default function Index() {
  const { nickname, rooms, myGroups, currentIndex, setCurrentIndex } =
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
        <Greeting nickname={nickname} />

        <ActiveRoomsCarousel
          rooms={rooms}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />

        <MyGroupsSection groups={myGroups} />
      </View>
    </ScrollView>
  );
}
