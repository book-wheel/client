import { Image, Pressable, StyleSheet, Text } from "react-native";
import type { BookItem } from "./types";

type Props = {
  book: BookItem;
  width: number;
  onPressBook: () => void;
};

export default function BookTile({ book, width, onPressBook }: Props) {
  return (
    <Pressable
      style={[styles.tile, { width }]}
      onPress={onPressBook}
    >
      <Image source={book.image} style={[styles.image, { width }]} />
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {book.author}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
  },
  image: {
    height: 142,
    borderRadius: 10,
    resizeMode: "contain",
  },
  title: {
    width: "100%",
    marginTop: 10,
    color: "#513A11",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  author: {
    width: "100%",
    marginTop: 4,
    color: "#A68D63",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
