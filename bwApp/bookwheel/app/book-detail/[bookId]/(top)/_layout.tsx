import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Stack, withLayoutContext } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import BookDetailHero from "@/components/books/BookDetailHero";

const Tab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Tab.Navigator);

const BOOK_DETAIL = {
  title: "내 남편을 팝니다",
  author: "고요한",
  pageCount: "236p",
  cover: require("@/assets/images/book.png"),
};

export default function BookDetailTabsLayout() {
  const [isInterested, setIsInterested] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "도서 검색",
        }}
      />

      <BookDetailHero
        {...BOOK_DETAIL}
        isInterested={isInterested}
        onToggleInterest={() => setIsInterested((currentValue) => !currentValue)}
      />

      <View style={styles.tabsContainer}>
        <TopTabs
          screenOptions={{
            tabBarActiveTintColor: "#513A11",
            tabBarInactiveTintColor: "#A19681",
            tabBarIndicatorStyle: {
              backgroundColor: "#513A11",
              height: 2.5,
            },
            tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
            tabBarStyle: {
              backgroundColor: "#FFF",
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderColor: "#F0E6D8",
              paddingTop: 5,
            },
          }}
        >
          <TopTabs.Screen name="info" options={{ title: "소개" }} />
          <TopTabs.Screen name="review" options={{ title: "리뷰" }} />
          <TopTabs.Screen name="gallery" options={{ title: "갤러리" }} />
        </TopTabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  tabsContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
