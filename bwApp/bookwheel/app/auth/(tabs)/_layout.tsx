import { Tabs } from "expo-router";

export default function AuthTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarPosition: "top" }}>
      <Tabs.Screen name="idfind" options={{ title: "아이디 찾기" }} />
      <Tabs.Screen name="pwfind" options={{ title: "비밀번호 찾기" }} />
    </Tabs>
  );
}
