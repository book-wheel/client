import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { router, Stack, useLocalSearchParams, withLayoutContext } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getApiErrorMessage } from "@/api/axios";
import { getBookDetail, toggleBookLike } from "@/api/books";
import BookDetailHero from "@/components/books/BookDetailHero";
import { BookDetailContext } from "@/contexts/book-detail";
import type { BookDetailContent } from "@/types/books";

const Tab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Tab.Navigator);

export default function BookDetailTabsLayout() {
  const insets = useSafeAreaInsets();
  const { isbn: rawIsbn } = useLocalSearchParams<{
    isbn?: string | string[];
  }>();
  const isbn = Array.isArray(rawIsbn) ? rawIsbn[0] : rawIsbn;

  const [book, setBook] = useState<BookDetailContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [isInterested, setIsInterested] = useState(false);
  const [isInterestLoading, setIsInterestLoading] = useState(false);

  const interestRequestingRef = useRef(false);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/search");
  };

  const handleToggleInterest = async () => {
    if (!isbn || interestRequestingRef.current) return;

    interestRequestingRef.current = true;
    setIsInterestLoading(true);
    try {
      const response = await toggleBookLike(isbn);
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(result.error?.message ?? "관심 도서 상태 변경에 실패했습니다.");
      }

    setIsInterested(result.data.liked);
    } catch (error) {
      console.error(
        "관심 도서 상태 변경 실패:",
        getApiErrorMessage(error, "관심 도서 상태 변경에 실패했습니다."),
      );
    } finally {
      interestRequestingRef.current = false;
      setIsInterestLoading(false);
    }
  }

  useEffect(() => {
    if (!isbn) return;

    let isActive = true;

    const fetchBookDetail = async () => {
      setBook(null);
      setIsLoading(true);
      setError(null);

      try {
        const response = await getBookDetail(isbn);
        const result = response.data;

        if (!result.success || !result.data) {
          if (!isActive) return;

          setError(
            new Error(
              result.error?.message ?? "도서 정보를 불러오지 못했습니다.",
            ),
          );
          return;
        }

        if (!isActive) return;

        setBook(result.data);
        setIsInterested(result.data.isInterested);
      } catch (fetchError) {
        const message = getApiErrorMessage(
          fetchError,
          "도서 정보를 불러오지 못했습니다.",
        );

        console.error("도서 정보 조회 실패:", message);
        setError(new Error(message));
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void fetchBookDetail();

    return () => {
      isActive = false;
    };
  }, [isbn]);

  return (
    <BookDetailContext.Provider value={{ book, isLoading, error, isbn }}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity
            accessibilityLabel="뒤로가기"
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={handleGoBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={30} color="#513A11" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>도서 조회</Text>
        </View>

        <BookDetailHero
          title={book?.title ?? "도서 정보"}
          author={book?.author ?? "저자명"}
          pageCount={book?.itemPage ? `${book.itemPage}p` : "페이지 정보 없음"}
          cover={book?.cover ? { uri: book.cover } : require("@/assets/images/book.png")}
          isInterested={isInterested}
          isInterestLoading={isInterestLoading}
          onToggleInterest={handleToggleInterest}
        />

        <View style={styles.tabsContainer}>
          <TopTabs
            screenOptions={{
              tabBarActiveTintColor: "#513A11",
              tabBarInactiveTintColor: "#A19681",
              tabBarIndicatorStyle: {
                backgroundColor: "#513A11",
                height: 2.5,
              },
              tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
              tabBarStyle: {
                backgroundColor: "#FFF",
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderColor: "#F0E6D8",
                paddingTop: 5,
              },
            }}
          >
            <TopTabs.Screen name="info" options={{ title: "소개" }} />
            <TopTabs.Screen name="review" options={{ title: "리뷰" }} />
            <TopTabs.Screen name="gallery" options={{ title: "갤러리" }} />
          </TopTabs>
        </View>
      </View>
    </BookDetailContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    marginLeft: 6,
    color: "#513A11",
    fontSize: 27,
    fontWeight: "900",
  },
  tabsContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
