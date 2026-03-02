import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import ReadingCard from "@/components/home/ReadingCard";
import { common } from "@/styles/common";
import Button from "@/components/Button";

export default function CompletedBooks() {
  const { id: rawId, memberId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [review, setReview] = useState("");

  const handleComplete = () => {
    router.replace({
      pathname: "/group/[id]/state",
      params: {
        id,
        memberId,
        newStatus: "completed",
      },
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ padding: 20 }}>
        <View
          style={{
            marginBottom: 24,
            padding: 10,
            borderRadius: 5,
            backgroundColor: "#FFFCF3",
          }}
        >
          {/* 도서 정보 */}
          <Text style={styles.sectionTitle}>도서 정보</Text>
          <ReadingCard
            image={require("@/assets/images/book.png")}
            title="키친은 모든 것을 말했다"
            author="스즈키 유키"
            owner="김주옥"
          />
          {/* 출판사 / 출간일 추가 정보 리딩 카드 안으로 옮기기*/}
          <View style={styles.bookMeta}>
            <Text style={styles.metaText}>출판사: ○○출판사</Text>
            <Text style={styles.metaText}>출간일: 2025년 1월 25일</Text>
          </View>
        </View>

        <View
          style={{
            marginBottom: 24,
            marginTop: 24,
            padding: 10,
            borderRadius: 5,
          }}
        >
          {/* 인증 사진 업로드 */}
          <Text style={styles.sectionTitle}>인증 사진 업로드 (5개 이하)</Text>

          <TouchableOpacity style={styles.uploadBox}>
            <Text style={{ fontSize: 40, color: "#ccc" }}>＋</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 24, padding: 10, borderRadius: 5 }}>
          {/* 감상평 남기기 */}
          <Text style={styles.sectionTitle}>감상평 남기기 (최소 20자)</Text>

          <TextInput
            style={styles.reviewInput}
            placeholder="이번 책을 읽고 느낀 점을 작성해주세요."
            multiline
            value={review}
            onChangeText={setReview}
          />
        </View>
        {/* 완독 버튼 */}
        <View style={{ alignItems: "center", marginTop: 24 }}>
          <Button title="완독" onPress={handleComplete} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#513A11",
    marginBottom: 6,
  },
  bookMeta: {
    marginTop: 8,
  },
  metaText: {
    fontSize: 13,
    color: "#513A11",
    marginBottom: 4,
  },
  uploadBox: {
    width: 140,
    height: 140,
    backgroundColor: "#EAEAEA",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewInput: {
    backgroundColor: "#EAEAEA",
    borderRadius: 12,
    padding: 16,
    height: 140,
    textAlignVertical: "top",
  },
  completeButton: {
    marginTop: 32,
    backgroundColor: "#D9A24E",
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: "center",
  },
  completeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
