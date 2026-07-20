import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Stack, useLocalSearchParams, withLayoutContext } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { getBookDetail } from "@/api/books";
import BookDetailHero from "@/components/books/BookDetailHero";
import { BookDetailContext } from "@/contexts/book-detail";
import type { BookDetailContent } from "@/types/books";

const Tab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Tab.Navigator);

export default function BookDetailTabsLayout() {
  const { bookId } = useLocalSearchParams<{ bookId?: string | string[] }>();
  const isbn = Array.isArray(bookId) ? bookId[0] : bookId;

  const [book, setBook] = useState<BookDetailContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    if (!isbn) return;

    const fetchBookDetail = async () => {
      setBook(null);
      setIsLoading(true);
      setError(null);

      try {
        const response = await getBookDetail(isbn);
        const result = response.data;

        if (!result.success || !result.data) {
          throw new Error(result.error?.message ?? "도서 정보를 불러오지 못했습니다.");
        }

        setBook(result.data);
        setIsInterested(result.data.isInterested);
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBookDetail();
  }, [isbn]);

  return (
    <BookDetailContext.Provider value={{ book, isLoading, error, isbn }}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "도서 검색",
          }}
        />

        <BookDetailHero
          title={book?.title ?? "도서 정보"}
          author={book?.author ?? "저자명"}
          pageCount={book?.itemPage ? `${book.itemPage}p` : "페이지 정보 없음"}
          cover={book?.cover ? { uri: book.cover } : require("@/assets/images/book.png")}
          isInterested={isInterested}
          onToggleInterest={() => setIsInterested((currentValue) => !currentValue)}
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
  tabsContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
