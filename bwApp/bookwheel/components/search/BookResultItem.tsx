import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { searchStyles as styles } from "./styles";
import type { BookSearchItem } from "@/types/books";

type Props = {
  book: BookSearchItem;
  isInterested: boolean;
  onPress: () => void;
  onToggleInterest: () => void;
};

export default function BookResultItem({
  book,
  isInterested,
  onPress,
  onToggleInterest,
}: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= 560;
  const coverWidth = isWide ? 160 : 104;
  const coverHeight = Math.round(coverWidth * 1.47);

  return (
    <Pressable
      style={[
        styles.resultItem,
        {
          gap: isWide ? 22 : 14,
          paddingVertical: isWide ? 26 : 20,
        },
      ]}
      onPress={onPress}
    >
      <Image
        source={
          book.thumbnail
            ? { uri: book.thumbnail }
            : require("@/assets/images/book.png")
        }
        style={[styles.bookImage, { width: coverWidth, height: coverHeight }]}
      />

      <View style={[styles.bookInfo, { gap: isWide ? 18 : 12 }]}>
        <MetaLine label="책 제목" value={book.title} />
        <MetaLine label="저자" value={book.author} />
        <MetaLine label="출판사" value={book.publisher} />
        <MetaLine label="출간일" value={book.publishedDate} />
      </View>

      <TouchableOpacity
        accessibilityLabel={isInterested ? "관심도서 해제" : "관심도서 등록"}
        accessibilityRole="button"
        activeOpacity={0.7}
        onPress={(event) => {
          event.stopPropagation();
          onToggleInterest();
        }}
        style={styles.heartButton}
      >
        <Ionicons
          name={isInterested ? "heart" : "heart-outline"}
          size={24}
          color={isInterested ? "#E4A54E" : "#513A11"}
        />
      </TouchableOpacity>
    </Pressable>
  );
}

type MetaLineProps = {
  label: string;
  value: string;
};

function MetaLine({ label, value }: MetaLineProps) {
  return (
    <Text style={styles.metaText} numberOfLines={2}>
      <Text style={styles.metaLabel}>{label} : </Text>
      {value}
    </Text>
  );
}
