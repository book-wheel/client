import { FlatList, StyleSheet } from "react-native";
import BookTile from "./BookTile";
import type { BookItem } from "./types";

const numColumns = 3;
const itemWidth = 96;

type Props = {
  books: BookItem[];
  onPressBook: (book: BookItem) => void;
  getIsInterested?: (book: BookItem) => boolean;
  onToggleInterest?: (book: BookItem) => void;
};

export default function BookGrid({
  books,
  onPressBook,
  getIsInterested,
  onToggleInterest,
}: Props) {
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <BookTile
          book={item}
          width={itemWidth}
          onPressBook={() => onPressBook(item)}
          isInterested={
            getIsInterested
              ? getIsInterested(item)
              : onToggleInterest
                ? true
                : undefined
          }
          onToggleInterest={
            onToggleInterest ? () => onToggleInterest(item) : undefined
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 24,
  },
});
