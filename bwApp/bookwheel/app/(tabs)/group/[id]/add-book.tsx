import ErrorNotice from "@/components/ErrorNotice";
import { getApiErrorMessage, showApiError } from "@/api/axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { getBookDetail } from "@/api/books";
import { registerBook } from "@/api/group-dashboard";
import AddBookForm from "@/components/group/add-book/AddBookForm";
import type { BookDetail } from "@/types/books";

export default function AddBook() {
  const { id, isbn: rowIsbn } = useLocalSearchParams();

  const groupId = Array.isArray(id) ? id[0] : id;
  const isbn = Array.isArray(rowIsbn) ? rowIsbn[0] : rowIsbn;

  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBook, setSelectedBook] = useState<BookDetail | null>(null);

  useEffect(() => {
    if (!isbn) return;

    let active = true;
    setErrorMessage("");

    const fetchBook = async () => {
      try {
        const res = await getBookDetail(isbn);
        const book = res.data.data;

        if (active && book) setSelectedBook(book);
      } catch (e) {
        if (active) setErrorMessage(getApiErrorMessage(e, "도서 정보를 불러오지 못했습니다."));
      }
    };

    fetchBook();

    return () => {
      active = false;
    };
  }, [isbn, retryCount]);

  const handleRegister = async ({
    bookCondition,
    noteToReader,
  }: {
    bookCondition: string;
    noteToReader: string;
  }) => {
    if (!groupId || !selectedBook) return;

    try {
      await registerBook(groupId, {
        isbn: selectedBook.isbn,
        title: selectedBook.title,
        author: selectedBook.author,
        publisher: selectedBook.publisher,
        pubDate: selectedBook.pubDate ?? "",
        coverImage: selectedBook.cover ?? "",
        totalPage: selectedBook.itemPage,
        bookCondition,
        noteToReader,
      });

      router.replace({
        pathname: "/group/[id]/state",
        params: { id: groupId },
      });
    } catch (error: any) {
      showApiError(error, "도서를 등록하지 못했습니다. 다시 시도해주세요.");
    }
  };

  if (errorMessage) {
    return (
      <ErrorNotice
        message={errorMessage}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  if (!selectedBook) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>선택된 책이 없습니다.</Text>
      </View>
    );
  }

  return <AddBookForm book={selectedBook} onSubmit={handleRegister} />;
}
