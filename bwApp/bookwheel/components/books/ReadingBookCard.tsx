import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { BookItem } from "./types";

type Props = {
  book: BookItem;
  groupName: string;
  onPressBook: () => void;
  onPressGroup: () => void;
};

export default function ReadingBookCard({
  book,
  groupName,
  onPressBook,
  onPressGroup,
}: Props) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPressBook}>
        <Image source={book.image} style={styles.image} />
      </Pressable>
      <TouchableOpacity
        style={styles.roomButton}
        activeOpacity={0.8}
        onPress={onPressGroup}
      >
        <View style={styles.roomButtonContent}>
          <Text style={styles.roomName}>{groupName}</Text>
          <Text style={styles.roomButtonSuffix}>으로 가기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 184,
    minHeight: 256,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#FFFCF3",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  image: {
    width: 126,
    height: 184,
    borderRadius: 10,
    resizeMode: "cover",
  },
  roomButton: {
    width: "100%",
    height: 30,
    marginTop: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCF5D7",
  },
  roomButtonContent: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 2,
  },
  roomName: {
    fontWeight: "900",
    color: "#513A11",
    fontSize: 13,
  },
  roomButtonSuffix: {
    color: "#7B6A4A",
    fontSize: 11,
    fontWeight: "700",
  },
});
