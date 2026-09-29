import { View, Text, TextInput } from "react-native";
import styles from "@/styles/completedBooks.style";

type Props = {
  review: string;
  setReview: (text: string) => void;
};

export default function ReviewInput({ review, setReview }: Props) {
  return (
    <View style={styles.sectionBox}>
      <Text style={styles.sectionTitle}>감상평</Text>

      <Text style={styles.sectionDescription}>
        읽고 난 뒤의 생각을 자유롭게 남겨주세요
      </Text>

      <TextInput
        style={styles.reviewInput}
        placeholder="기억에 남는 장면이나 문장을 적어보세요."
        placeholderTextColor="#B8A47F"
        multiline
        value={review}
        onChangeText={setReview}
        textAlignVertical="top"
      />

      {review.length > 0 && (
        <Text style={styles.reviewCount}>{review.length}자</Text>
      )}
    </View>
  );
}
