import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, ToastAndroid, View } from "react-native";
import { Colors } from "@/constants/theme";
import { mockInterestBooks } from "@/mocks/books/interests";

import BookGrid from "../../../components/books/BookGrid";
import type { BookItem } from "../../../components/books/types";

const removedInterestBookIdsKey = "removedInterestBookIds";

const showStorageErrorToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }

  Alert.alert("알림", message);
};

const getStoredRemovedBookIds = async () => {
  const storedValue = await AsyncStorage.getItem(removedInterestBookIdsKey);

  if (!storedValue) {
    return new Set<string>();
  }

  try {
    const ids = JSON.parse(storedValue);

    if (Array.isArray(ids)) {
      return new Set(ids.filter((id): id is string => typeof id === "string"));
    }
  } catch {
    return new Set<string>();
  }

  return new Set<string>();
};

const saveStoredRemovedBookIds = async (ids: Set<string>) => {
  await AsyncStorage.setItem(
    removedInterestBookIdsKey,
    JSON.stringify(Array.from(ids)),
  );
};

const updateStoredRemovedBookIds = async (
  bookId: string,
  shouldRemove: boolean,
) => {
  try {
    const removedBookIds = await getStoredRemovedBookIds();

    if (shouldRemove) {
      removedBookIds.add(bookId);
    } else {
      removedBookIds.delete(bookId);
    }

    await saveStoredRemovedBookIds(removedBookIds);
  } catch (error) {
    console.warn("Failed to update removed interest books.", error);
    showStorageErrorToast("관심도서 변경을 저장하지 못했어요.");
  }
};

export default function AllInterest() {
  const [books, setBooks] = useState<BookItem[]>(mockInterestBooks);
  const [interestedBookIds, setInterestedBookIds] = useState(
    () => new Set(mockInterestBooks.map((book) => book.id)),
  );

  useEffect(() => {
    let isMounted = true;

    const applyStoredRemovedBooks = async () => {
      const removedBookIds = await getStoredRemovedBookIds();
      const visibleBooks = mockInterestBooks.filter(
        (book) => !removedBookIds.has(book.id),
      );

      if (!isMounted) {
        return;
      }

      setBooks(visibleBooks);
      setInterestedBookIds(new Set(visibleBooks.map((book) => book.id)));
    };

    void applyStoredRemovedBooks().catch((error) => {
      console.warn("Failed to load removed interest books.", error);
      showStorageErrorToast("관심도서 정보를 불러오지 못했어요.");
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleInterest = (book: BookItem) => {
    const isCurrentlyInterested = interestedBookIds.has(book.id);

    setInterestedBookIds((prev) => {
      const next = new Set(prev);

      if (next.has(book.id)) {
        next.delete(book.id);
      } else {
        next.add(book.id);
      }

      return next;
    });
    void updateStoredRemovedBookIds(book.id, isCurrentlyInterested);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "관심 도서",
          headerShown: true,
        }}
      />

      <BookGrid
        books={books}
        onPressBook={() => router.push("/book-detail/1/info")}
        getIsInterested={(book) => interestedBookIds.has(book.id)}
        onToggleInterest={handleToggleInterest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
