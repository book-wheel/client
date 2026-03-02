import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/Button";
import { router } from "expo-router";

type Props = {
  image: any;
  title: string;
  author: string;
  owner: string;
  buttonText?: string;
  onPress?: () => void;
};

export default function ReadingCard({
  image,
  title,
  author,
  owner,
  buttonText,
  onPress,
}: Props) {
  return (
    <>
      <View style={styles.card}>
        {/* 책 이미지 */}
        <Image source={image} style={styles.bookImage} />

        {/* 텍스트 영역 */}
        <View style={styles.info}>
          {/* 소유자 배지 */}
          <View style={styles.ownerBadge}>
            <Text style={styles.ownerText}>{owner}</Text>
          </View>

          <Text style={styles.label}>책 제목</Text>
          <Text style={styles.value}>{title}</Text>

          <Text style={styles.label}>저자</Text>
          <Text style={styles.value}>{author}</Text>

          {/* 완독 인증 버튼 */}
          {onPress && (
            <Button
              title={buttonText ?? "완독 인증 하기"}
              style={{ width: 220, marginTop: 20 }}
              onPress={onPress}
            />
          )}
        </View>
      </View>

      <View></View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "95%",
    height: 260,

    flexDirection: "row",
    padding: 16,

    // borderRadius: 5,
    // backgroundColor: "#FFFCF3",

    justifyContent: "center", // 세로 기준 가운데
    alignItems: "center", // 가로 기준 가운데
  },

  bookImage: {
    width: 130,
    height: 191,
    borderRadius: 10,
    marginRight: 14,
    borderColor: "#513A11",
    borderWidth: 1,
  },

  info: {
    flex: 1,
    justifyContent: "space-between",
  },

  label: {
    fontSize: 11,
    color: "#999",
  },

  value: {
    fontSize: 13,
    color: "#513A11",
    fontWeight: "600",
    marginBottom: 14,
  },
  ownerBadge: {
    marginTop: 34,
    marginBottom: 15,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#FCF5D7",
  },

  ownerText: {
    fontSize: 12,
    color: "#E4A54E",
    fontWeight: "600",
  },
});
