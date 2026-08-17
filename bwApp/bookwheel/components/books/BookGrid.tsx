import { ActivityIndicator, FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import BookTile from "./BookTile";
import type { BookItem } from "./types";

const numColumns = 3;
const maxItemWidth = 96;
const columnGap = 20;
const horizontalPadding = 20;

type InterestToggleProps =
  | {
      getIsInterested: (book: BookItem) => boolean;
      onToggleInterest: (book: BookItem) => void;
    }
  | {
      getIsInterested?: undefined;
      onToggleInterest?: undefined;
    };

type Props = {
  books: BookItem[];
  getIsUpdatingInterest?: (book: BookItem) => boolean;
  isLoading?: boolean;
  onEndReached?: () => void;
  onPressBook: (book: BookItem) => void;
} & InterestToggleProps;

export default function BookGrid({
  books,
  getIsUpdatingInterest,
  isLoading = false,
  onEndReached,
  onPressBook,
  getIsInterested,
  onToggleInterest,
}: Props) {
  const { width } = useWindowDimensions();
  const itemWidth = Math.min(
    maxItemWidth,
    (width - horizontalPadding * 2 - columnGap * (numColumns - 1)) /
      numColumns,
  );

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#E4A54E" />
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <BookTile
          book={item}
          width={itemWidth}
          onPressBook={() => onPressBook(item)}
          isInterested={getIsInterested?.(item)}
          isUpdatingInterest={getIsUpdatingInterest?.(item)}
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
    paddingHorizontal: horizontalPadding,
    paddingTop: 24,
    paddingBottom: 48,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    gap: columnGap,
    marginBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 20,
  },
});
