import "react-native-gesture-handler";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/use-color-scheme";

import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";
import { NotificationProvider } from "@/contexts/notifications";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <NotificationProvider>
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
            <Stack.Screen
              name="book-detail/[isbn]/[postId]/comment"
              options={{
                headerShown: false,
                presentation: "transparentModal",
                animation: "fade",
                contentStyle: { backgroundColor: "transparent" },
              }}
            />
          </Stack>
          <Toast config={toastConfig} />

          <StatusBar style="auto" />
        </NotificationProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
