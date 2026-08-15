import { getApiErrorMessage } from "@/api/axios";
import {
  getInterestedBooks,
  toggleBookLike,
} from "@/api/books";
import BookGrid from "@/components/books/BookGrid";
import type { BookItem } from "@/components/books/types";
import { Colors } from "@/constants/theme";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import type { CursorParams } from "@/types/api";
import type { InterestedBookContent } from "@/types/books";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AllInterest() {
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingBookIsbns, setUpdatingBookIsbns] = useState<Set<string>>(
    () => new Set(),
  );
  const updatingBookIsbnsRef = useRef(new Set<string>());

  const fetchInterestPage = useCallback(async (params: CursorParams) => {
    const response = await getInterestedBooks(params);
    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(
        result.error?.message ?? "관심 도서를 불러오지 못했습니다.",
      );
    }

    return result.data;
  }, []);

  const {
    items: interestedBooks,
    isLoading,
    error,
    loadInitial,
    loadMore,
    reset,
  } = useCursorPagination<InterestedBookContent>({
    fetchPage: fetchInterestPage,
    pageSize: 30,
  });

  useFocusEffect(
    useCallback(() => {
      setActionError(null);
      reset();
      void loadInitial();
    }, [loadInitial, reset]),
  );

  const books = useMemo<BookItem[]>(
    () =>
      interestedBooks.map((book) => ({
        id: String(book.bookInfoId),
        isbn: book.isbn,
        title: book.title ?? "제목 없음",
        author: book.author ?? "저자 미상",
        image: book.coverImageUrl
          ? { uri: book.coverImageUrl }
          : undefined,
      })),
    [interestedBooks],
  );

  const handlePressBook = (book: BookItem) => {
    if (!book.isbn) return;

    router.push({
      pathname: "/book-detail/[isbn]/info",
      params: { isbn: book.isbn },
    });
  };

  const handleToggleInterest = async (book: BookItem) => {
    if (!book.isbn || updatingBookIsbnsRef.current.has(book.isbn)) return;

    setActionError(null);
    updatingBookIsbnsRef.current.add(book.isbn);
    setUpdatingBookIsbns(new Set(updatingBookIsbnsRef.current));

    try {
      const response = await toggleBookLike(book.isbn);
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message ?? "관심 도서를 변경하지 못했습니다.",
        );
      }

      reset();
      await loadInitial();
    } catch (caughtError) {
      setActionError(
        getApiErrorMessage(
          caughtError,
          "관심 도서를 변경하지 못했습니다.",
        ),
      );
    } finally {
      updatingBookIsbnsRef.current.delete(book.isbn);
      setUpdatingBookIsbns(new Set(updatingBookIsbnsRef.current));
    }
  };

  const errorMessage = error
    ? getApiErrorMessage(error, "관심 도서를 불러오지 못했습니다.")
    : null;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "관심 도서",
          headerShown: true,
        }}
      />

      {errorMessage && books.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{errorMessage}</Text>
        </View>
      ) : !isLoading && books.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>아직 관심 도서가 없습니다.</Text>
        </View>
      ) : (
        <>
          {actionError ? (
            <Text style={styles.actionError}>{actionError}</Text>
          ) : null}
          <BookGrid
            books={books}
            isLoading={isLoading}
            onEndReached={() => void loadMore()}
            onPressBook={handlePressBook}
            getIsInterested={() => true}
            getIsUpdatingInterest={(book) =>
              Boolean(book.isbn && updatingBookIsbns.has(book.isbn))
            }
            onToggleInterest={(book) => void handleToggleInterest(book)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  message: {
    color: "#A68D63",
    fontSize: 14,
    textAlign: "center",
  },
  actionError: {
    paddingHorizontal: 20,
    paddingTop: 12,
    color: "#B84A4A",
    fontSize: 12,
    textAlign: "center",
  },
});
