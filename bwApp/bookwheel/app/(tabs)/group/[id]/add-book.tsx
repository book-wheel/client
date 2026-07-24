import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { getBookDetail } from "@/api/books";
import { getDashboard, registerBook } from "@/api/group-dashboard";
import AddBookForm from "@/components/group/add-book/AddBookForm";
import type { BookDetail } from "@/types/books";

export default function AddBook() {
  const { id, bookId } = useLocalSearchParams();

  const groupId = Array.isArray(id) ? id[0] : id;
  const isbn = Array.isArray(bookId) ? bookId[0] : bookId;

  const [selectedBook, setSelectedBook] = useState<BookDetail | null>(null);

  useEffect(() => {
    if (!isbn) return;

    let active = true;

    const fetchBook = async () => {
      try {
        const res = await getBookDetail(isbn);
        const book = res.data.data;

        if (active && book) setSelectedBook(book);
      } catch (e) {
        console.log(e);
      }
    };

    fetchBook();

    return () => {
      active = false;
    };
  }, [isbn]);

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
        coverImage: selectedBook.cover,
        totalPage: selectedBook.itemPage,
        bookCondition,
        noteToReader,
      });

      const dashboard = await getDashboard(groupId);
      console.log("등록 직후 대시보드", JSON.stringify(dashboard, null, 2));

      router.replace({
        pathname: "/group/[id]/state",
        params: { id: groupId },
      });
    } catch (error: any) {
      console.log("status", error.response?.status);
      console.log("data", JSON.stringify(error.response?.data, null, 2));
    }
  };

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
