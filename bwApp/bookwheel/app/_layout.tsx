import "react-native-gesture-handler";

import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useColorScheme} from "@/hooks/use-color-scheme";

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="auth/login" options={{headerShown: false}}/>
                    <Stack.Screen name="auth/profile" options={{headerShown: false}}/>
                    <Stack.Screen
                        name="(modal)/group/explore"
                        options={{title: "탐색"}}
                    />
                    <Stack.Screen
                        name="(modal)/group/create/step1"
                        options={{title: "모임 생성"}}
                    />
                    <Stack.Screen
                        name="(modal)/group/create/step2"
                        options={{title: "모임 생성"}}
                    />
                    <Stack.Screen
                        name="(modal)/group/create/step3"
                        options={{title: "모임 생성"}}
                    />
                    <Stack.Screen
                        name="book-detail/[isbn]/[galleryId]/comment"
                        options={{
                            headerShown: false,
                            presentation: "transparentModal",
                            animation: "none",
                            contentStyle: { backgroundColor: "transparent" },
                        }}
                    />
                </Stack>
                <StatusBar style="auto"/>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
