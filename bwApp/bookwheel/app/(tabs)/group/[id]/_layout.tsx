import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";
import { headerOptions } from "@/constants/header";

export default function GroupIdLayout() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const groupTitle = name || "교환독서방";

  return (
    <Stack screenOptions={{ ...headerOptions, headerShown: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen
        name="(top)"
        options={{
          title: groupTitle,
          headerBackVisible: false,
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              displayMode="minimal"
              accessibilityLabel="뒤로가기"
              onPress={() => router.push("/(tabs)/groups")}
            />
          ),
        }}
      />
      <Stack.Screen name="completed-books" options={{ title: "완독한 책" }} />
      <Stack.Screen
        name="group-settings"
        options={{
          title: "모임 설정",
          headerTitleAlign: "left",
          headerTintColor: "#513A11",
          headerTitleStyle: { fontSize: 15, fontWeight: "700" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="member-management"
        options={{
          headerBackButtonDisplayMode: "minimal",
          title: groupTitle,
          headerTintColor: "#513A11",
          headerTitleStyle: { fontSize: 18, fontWeight: "800" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="schedule-settings"
        options={{
          headerBackButtonDisplayMode: "minimal",
          title: groupTitle,
          headerTintColor: "#513A11",
          headerTitleStyle: { fontSize: 18, fontWeight: "800" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
