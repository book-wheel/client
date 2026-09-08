import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import Button from "@/components/Button";

type Props = {
  image: ImageSourcePropType | string;
  title: string;
  author?: string;
  owner?: string;
  buttonText?: string;
  onPress?: () => void;
  titleOnly?: boolean;
  statusLabel?: string;
};

export default function ReadingCard({
  image,
  title,
  author,
  owner,
  buttonText,
  onPress,
  titleOnly = false,
  statusLabel,
}: Props) {
  return (
    <View style={[styles.card, titleOnly && styles.titleOnlyCard]}>
      {/* 책 이미지 */}
      <Image source={typeof image === "string" ? { uri: image } : image} style={styles.bookImage} />

      {/* 텍스트 영역 */}
      <View style={[styles.info, titleOnly && styles.titleOnlyInfo]}>
        {statusLabel && <Text style={styles.statusLabel}>{statusLabel}</Text>}

        {/* 소유자 배지 */}
        {!titleOnly && owner && (
          <View style={styles.ownerBadge}>
            <Text style={styles.ownerText}>{owner}</Text>
          </View>
        )}

        <Text style={styles.label}>책 제목</Text>
        <Text style={styles.value}>{title}</Text>

        {!titleOnly && author && (
          <>
            <Text style={styles.label}>저자</Text>
            <Text style={styles.value}>{author}</Text>
          </>
        )}

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

  titleOnlyCard: {
    height: 230,
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

  titleOnlyInfo: {
    justifyContent: "center",
  },

  statusLabel: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FCF5D7",
    color: "#B8873D",
    fontSize: 12,
    fontWeight: "600",
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
