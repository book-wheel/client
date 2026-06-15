import { View, Text } from "react-native";
import ReadingCard from "@/components/home/ReadingCard";

type Book = {
  title: string;
  owner: string;
  image: {
    uri: string;
  };
};

type Props = {
  book: Book | null;
  buttonText: string;
  onPress: () => void;
};

export default function CurrentBookSection({
  book,
  buttonText,
  onPress,
}: Props) {
  if (!book) {
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
      </View>
    );
  }

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
        author="" // API에 없음
        owner={book.owner}
        buttonText={buttonText}
        onPress={onPress}
      />
    </View>
  );
}
