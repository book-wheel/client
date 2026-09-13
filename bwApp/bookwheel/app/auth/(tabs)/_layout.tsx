import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";

import IdFind from "./idfind";
import PwFind from "./pwfind";
import { Stack } from "expo-router";

const Tab = createMaterialTopTabNavigator();

export default function AuthTabs() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "아이디/비밀번호 찾기",
        }}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: "#E4A54E",
            height: 2,
          },
          tabBarActiveTintColor: "#513A11",
        }}
      >
        <Tab.Screen name="idfind" component={IdFind} />
        <Tab.Screen name="pwfind" component={PwFind} />
      </Tab.Navigator>
    </>
  );
}
