import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/theme";
import { mockInterestBooks } from "@/mocks/books/interests";

import BookGrid from "../../../components/books/BookGrid";

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
        books={mockInterestBooks}
        onPressBook={() => router.push("/book-detail/1/info")}
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
