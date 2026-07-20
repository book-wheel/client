import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { getBookDetail } from "@/api/books";
import { getDashboard, registerBook } from "@/api/group-dashboard";

export default function AddBook() {
  const { id, bookId } = useLocalSearchParams();

  const groupId = Array.isArray(id) ? id[0] : id;
  const isbn = Array.isArray(bookId) ? bookId[0] : bookId;

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [bookCondition, setBookCondition] = useState("");
  const [noteToReader, setNoteToReader] = useState("");
  useEffect(() => {
    if (!isbn) return;

    const fetchBook = async () => {
      try {
        const res = await getBookDetail(isbn);

        console.log(JSON.stringify(res.data, null, 2));

        setSelectedBook(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchBook();
  }, [isbn]);

  const handleRegister = async () => {
    if (!groupId || !selectedBook) return;

    try {
      const response = await registerBook(groupId, {
        isbn: selectedBook.isbn,
        title: selectedBook.title,
        author: selectedBook.author,
        publisher: selectedBook.publisher,
        pubDate: "",
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFF" }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: "#513A11",
          marginBottom: 24,
        }}
      >
        책 등록
      </Text>

      {/* 책 정보 */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#FFF8E8",
          borderRadius: 20,
          padding: 16,
        }}
      >
        <Image
          source={{ uri: selectedBook.cover }}
          style={{
            width: 80,
            height: 120,
            borderRadius: 10,
          }}
        />

        <View
          style={{
            flex: 1,
            marginLeft: 16,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#513A11",
            }}
          >
            {selectedBook.title}
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: "#8A8A8A",
            }}
          >
            {selectedBook.author}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: "#8A8A8A",
            }}
          >
            {selectedBook.publisher}
          </Text>
        </View>
      </View>

      {/* 책 상태 */}
      <Text
        style={{
          marginTop: 32,
          marginBottom: 12,
          fontSize: 16,
          fontWeight: "600",
          color: "#513A11",
        }}
      >
        책 상태
      </Text>

      <TextInput
        value={bookCondition}
        onChangeText={setBookCondition}
        placeholder="책 상태를 적어주세요"
        multiline
        style={{
          backgroundColor: "#FAFAFA",
          borderRadius: 15,
          padding: 16,
          minHeight: 100,
          textAlignVertical: "top",
        }}
      />

      {/* 메모 */}
      <Text
        style={{
          marginTop: 32,
          marginBottom: 12,
          fontSize: 16,
          fontWeight: "600",
          color: "#513A11",
        }}
      >
        다음 독자에게 남길 메모
      </Text>

      <TextInput
        value={noteToReader}
        onChangeText={setNoteToReader}
        placeholder="소중히 읽어주세요 :)"
        multiline
        style={{
          backgroundColor: "#FAFAFA",
          borderRadius: 15,
          padding: 16,
          minHeight: 120,
          textAlignVertical: "top",
        }}
      />

      {/* 등록 버튼 */}
      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: "#B8955B",
          borderRadius: 15,
          alignItems: "center",
          paddingVertical: 18,
          marginTop: 40,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          등록하기
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
