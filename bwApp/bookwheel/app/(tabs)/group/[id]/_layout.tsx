import {
  Stack,
  useRouter,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GroupIdLayout() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="(top)"
        options={{
          title: name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/(tabs)/groups")}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="completed-books" options={{ title: "완독한 책" }} />
    </Stack>
  );
}
