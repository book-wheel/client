import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "index") iconName = "home-outline";
          else if (route.name === "groups") iconName = "people-outline";
          else if (route.name === "books") iconName = "book-outline";
          else if (route.name === "setting") iconName = "settings-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          height: 100,
          paddingBottom: 30,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#E4A54E",
        tabBarInactiveTintColor: "#513A11",
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "홈", headerShown: true }} />
      <Tabs.Screen name="groups" options={{ title: "모임" }} />
      <Tabs.Screen name="books" options={{ title: "책" }} />
      <Tabs.Screen name="setting" options={{ title: "설정" }} />

      <Tabs.Screen name="group" options={{ href: null }} />
    </Tabs>
  );
}
