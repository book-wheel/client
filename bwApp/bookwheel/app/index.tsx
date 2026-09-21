import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import type { SocialOnboardingStep } from "@/utils/socialOnboarding";

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<
    "/auth/login" | "/auth/social-consent" | "/auth/profile" | "/(tabs)" | null
  >(null);

  // 저장된 세션이 있으면 앱 재실행·푸시 진입에서도 로그인을 유지
  useEffect(() => {
    let isActive = true;

    void AsyncStorage.multiGet([
      "accessToken",
      "socialOnboardingStep",
    ]).then((entries) => {
      if (!isActive) return;

      const accessToken = entries[0][1];
      const onboardingStep = entries[1][1] as SocialOnboardingStep | null;

      if (!accessToken) {
        setInitialRoute("/auth/login");
      } else if (onboardingStep === "consent") {
        setInitialRoute("/auth/social-consent");
      } else if (onboardingStep === "profile") {
        setInitialRoute("/auth/profile");
      } else {
        setInitialRoute("/(tabs)");
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  if (initialRoute === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E4A54E" />
      </View>
    );
  }

  return <Redirect href={initialRoute} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EDE0",
  },
});
