import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { BookDetail } from "@/types/books";

type AddBookValues = {
  bookCondition: string;
  noteToReader: string;
};

type Props = {
  book: BookDetail;
  onSubmit: (values: AddBookValues) => Promise<void>;
};

export default function AddBookForm({ book, onSubmit }: Props) {
  const [bookCondition, setBookCondition] = useState("");
  const [noteToReader, setNoteToReader] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      await onSubmit({ bookCondition, noteToReader });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>책 등록</Text>

      <BookSummaryCard book={book} />

      <LabeledMultilineInput
        label="책 상태"
        value={bookCondition}
        onChangeText={setBookCondition}
        placeholder="책 상태를 적어주세요"
        minHeight={100}
      />

      <LabeledMultilineInput
        label="다음 독자에게 남길 메모"
        value={noteToReader}
        onChangeText={setNoteToReader}
        placeholder="소중히 읽어주세요 :)"
        minHeight={120}
      />

      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.75}
        disabled={submitting}
        onPress={handleSubmit}
        style={[styles.submitButton, submitting && styles.disabledButton]}
      >
        <Text style={styles.submitText}>
          {submitting ? "등록 중..." : "등록하기"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function BookSummaryCard({ book }: { book: BookDetail }) {
  return (
    <View style={styles.bookCard}>
      <Image
        source={
          book.cover
            ? { uri: book.cover }
            : require("@/assets/images/book.png")
        }
        style={styles.cover}
      />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.metadata}>{book.author}</Text>
        <Text style={styles.publisher}>{book.publisher}</Text>
      </View>
    </View>
  );
}

type LabeledMultilineInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  minHeight: number;
};

function LabeledMultilineInput({
  label,
  value,
  onChangeText,
  placeholder,
  minHeight,
}: LabeledMultilineInputProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        style={[styles.input, { minHeight }]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 24,
    color: "#513A11",
    fontSize: 24,
    fontWeight: "700",
  },
  bookCard: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: "#FFF8E8",
    padding: 16,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 16,
  },
  bookTitle: {
    color: "#513A11",
    fontSize: 18,
    fontWeight: "700",
  },
  metadata: {
    marginTop: 8,
    color: "#8A8A8A",
  },
  publisher: {
    marginTop: 4,
    color: "#8A8A8A",
  },
  label: {
    marginTop: 32,
    marginBottom: 12,
    color: "#513A11",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderRadius: 15,
    backgroundColor: "#FAFAFA",
    padding: 16,
    textAlignVertical: "top",
  },
  submitButton: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
    borderRadius: 15,
    backgroundColor: "#B8955B",
    paddingVertical: 18,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
