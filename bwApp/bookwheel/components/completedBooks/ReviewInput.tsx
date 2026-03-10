import { View, Text, TextInput } from "react-native";
import styles from "@/styles/completedBooks.style";

type Props = {
  review: string;
  setReview: (text: string) => void;
};

export default function ReviewInput({ review, setReview }: Props) {
  return (
    <View style={styles.sectionBox}>
      <Text style={styles.sectionTitle}>감상평 남기기 (최소 20자)</Text>

      <TextInput
        style={styles.reviewInput}
        placeholder="이번 책을 읽고 느낀 점을 작성해주세요."
        multiline
        value={review}
        onChangeText={setReview}
      />
    </View>
  );
}
