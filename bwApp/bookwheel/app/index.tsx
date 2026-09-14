import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 저장된 세션이 있으면 앱 재실행·푸시 진입에서도 로그인을 유지
  useEffect(() => {
    let isActive = true;

    void AsyncStorage.getItem("accessToken").then((accessToken) => {
      if (isActive) setIsAuthenticated(Boolean(accessToken));
    });

    return () => {
      isActive = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E4A54E" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/auth/login"} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EDE0",
  },
});
