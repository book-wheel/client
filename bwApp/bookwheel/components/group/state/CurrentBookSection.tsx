import { View, Text } from "react-native";
import ReadingCard from "@/components/home/ReadingCard";

type Book = {
  title: string;
  author: string;
  owner: string;
  image: any;
};

type Props = {
  book: Book;
  buttonText: string;
  onPress: () => void;
};

export default function CurrentBookSection({
  book,
  buttonText,
  onPress,
}: Props) {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#513A11",
          marginBottom: 12,
        }}
      >
        진행중인 도서
      </Text>

      <ReadingCard
        image={book.image}
        title={book.title}
        author={book.author}
        owner={book.owner}
        buttonText={buttonText}
        onPress={onPress}
      />
    </View>
  );
}
