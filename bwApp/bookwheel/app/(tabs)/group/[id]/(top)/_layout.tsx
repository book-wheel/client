import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Tabs } from "expo-router";
import Home from "./home";
import State from "./state";
import Setting from "./setting";

const Tab = createMaterialTopTabNavigator();

export default function GroupTopTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={Home} options={{ title: "홈" }} />
      <Tab.Screen name="state" component={State} options={{ title: "상태" }} />
      <Tab.Screen
        name="setting"
        component={Setting}
        options={{ title: "세팅" }}
      />
    </Tab.Navigator>

    // <Tabs
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarPosition: "top", // 상단 탭
    //   }}
    // >
    //   <Tabs.Screen name="home" options={{ title: "홈" }} />
    //   <Tabs.Screen name="state" options={{ title: "상태" }} />
    //   <Tabs.Screen name="setting" options={{ title: "세팅" }} />
    // </Tabs>
  );
}
