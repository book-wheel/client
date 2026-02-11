import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="groups" options={{ title: "모임" }} />
      <Tabs.Screen name="books" options={{ title: "책" }} />
      <Tabs.Screen name="setting" options={{ title: "설정" }} />

      <Tabs.Screen name="group" options={{ href: null }} />
    </Tabs>
  );
}
