import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { searchBooks } from "@/components/search/constants";
import { registerBook } from "@/api/group-dashboard";

export default function AddBook() {
  const { id, bookId } = useLocalSearchParams();

  const groupId = Array.isArray(id) ? id[0] : id;
  const selectedBookId = Array.isArray(bookId) ? bookId[0] : bookId;

  const selectedBook = searchBooks.find((book) => book.id === selectedBookId);

  const [bookCondition, setBookCondition] = useState("");
  const [noteToReader, setNoteToReader] = useState("");

  const handleRegister = async () => {
    if (!groupId || !selectedBook) return;

    try {
      const response = await registerBook(groupId, {
        isbn: "9791190090018",
        title: selectedBook.title,
        author: selectedBook.author,
        publisher: selectedBook.publisher,
        pubDate: selectedBook.publishedAt,
        coverImage: "",
        totalPage: selectedBook.pageCount,
        bookCondition,
        noteToReader,
      });

      console.log("책 등록 응답:", JSON.stringify(response, null, 2));

      router.replace({
        pathname: "/group/[id]/state",
        params: { id: groupId },
      });
    } catch (error: any) {
      console.log("응답 데이터", error.response?.data);
      console.log("응답 상태", error.response?.status);

      console.error("책 등록 실패:", error);
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
          source={selectedBook.image}
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
