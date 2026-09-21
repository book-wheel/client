import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";
import { headerOptions } from "@/constants/header";

export default function GroupIdLayout() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  return (
    <Stack screenOptions={{ ...headerOptions, headerShown: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen
        name="(top)"
        options={{
          title: name || "모임",
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
    </Stack>
  );
}
