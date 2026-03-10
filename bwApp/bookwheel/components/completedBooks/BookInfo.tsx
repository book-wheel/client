import { View, Text } from "react-native";
import ReadingCard from "@/components/home/ReadingCard";
import styles from "@/styles/completedBooks.style";

type Props = {
  image: any;
  title: string;
  author: string;
  owner: string;
  publisher?: string;
  publishDate?: string;
};

export default function BookInfo({
  image,
  title,
  author,
  owner,
  publisher,
  publishDate,
}: Props) {
  return (
    <View style={styles.sectionBox}>
      <Text style={styles.sectionTitle}>도서 정보</Text>

      <ReadingCard image={image} title={title} author={author} owner={owner} />

      <View style={styles.bookMeta}>
        {publisher && <Text style={styles.metaText}>출판사: {publisher}</Text>}
        {publishDate && (
          <Text style={styles.metaText}>출간일: {publishDate}</Text>
        )}
      </View>
    </View>
  );
}
