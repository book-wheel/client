import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Tabs } from "expo-router";
import Home from "./home";
import State from "./state";
import Setting from "./setting";

const Tab = createMaterialTopTabNavigator();
export default function GroupTopTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#E4A54E",
        tabBarInactiveTintColor: "#999",

        tabBarIndicatorStyle: {
          backgroundColor: "#E4A54E",
          height: 3,
          borderRadius: 999,
        },

        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "700",
          textTransform: "none",
        },

        tabBarStyle: {
          backgroundColor: "#FFF",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#F2F2F2",
        },

        tabBarPressColor: "transparent",
      }}
    >
      <Tab.Screen name="home" component={Home} options={{ title: "홈" }} />
      <Tab.Screen name="state" component={State} options={{ title: "상태" }} />
      <Tab.Screen
        name="setting"
        component={Setting}
        options={{ title: "세팅" }}
      />
    </Tab.Navigator>
  );
}
