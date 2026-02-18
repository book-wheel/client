import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />

        <Stack.Screen name="auth/profile" options={{ headerShown: false }} />

        <Stack.Screen
          name="(modal)/group/explore"
          options={{ title: "탐색" }}
        />

        <Stack.Screen
          name="(modal)/group/create/step1"
          options={{ title: "모임 생성" }}
        />
        <Stack.Screen
          name="(modal)/group/create/step2"
          options={{ title: "모임 생성" }}
        />
        <Stack.Screen
          name="(modal)/group/create/step3"
          options={{ title: "모임 생성" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
