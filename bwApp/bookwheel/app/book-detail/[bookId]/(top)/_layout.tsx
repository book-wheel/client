import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

const Tab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Tab.Navigator);

export default function BookDetailTabsLayout() {
  return (
    <TopTabs>
      <TopTabs.Screen name="info" options={{ title: "소개" }} />
      <TopTabs.Screen name="review" options={{ title: "리뷰" }} />
      <TopTabs.Screen name="gallery" options={{ title: "갤러리" }} />
    </TopTabs>
  );
}
