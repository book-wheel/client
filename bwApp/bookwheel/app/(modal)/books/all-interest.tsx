import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import BookGrid from "../../../components/books/BookGrid";
import type { BookItem } from "../../../components/books/types";

const bookImage = require("@/assets/images/book.png");

const interestBooks: BookItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  title: `관심 도서 ${index + 1}`,
  author: "책바퀴",
  image: bookImage,
}));

export default function AllInterest() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "관심 도서",
          headerShown: true,
        }}
      />

      <BookGrid
        books={interestBooks}
        onPressBook={() => router.push("/book-detail/1/info")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
