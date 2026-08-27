import { Image, StyleSheet, Text, View } from "react-native";

import type { HomeReadingRoom } from "@/types/room";

type Props = {
  room: HomeReadingRoom;
  statusLabel: string;
};

type BookColumnProps = {
  label: string;
  title?: string;
  coverImage?: string | null;
  detail?: string | null;
};

function BookColumn({ label, title, coverImage, detail }: BookColumnProps) {
  return (
    <View style={styles.bookColumn}>
      <Text style={styles.bookLabel}>{label}</Text>
      <Image
        source={
          coverImage
            ? { uri: coverImage }
            : require("@/assets/images/book.png")
        }
        style={styles.cover}
        resizeMode="cover"
      />
      <Text numberOfLines={2} style={styles.bookTitle}>
        {title ?? "책 정보가 아직 없어요"}
      </Text>
      {detail ? (
        <Text numberOfLines={1} style={styles.bookDetail}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

export default function ReadingGroupCard({ room, statusLabel }: Props) {
  const readingDetail = room.myStep?.senderNickname
    ? `${room.myStep.senderNickname}님이 전달`
    : null;
  const registeredBookDetail = room.myBookStep?.holderNickname
    ? `${room.myBookStep.holderNickname}님이 읽을 책`
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.groupName} numberOfLines={1}>
          {room.groupName}
        </Text>
        <Text style={styles.statusLabel}>{statusLabel}</Text>
      </View>

      <View style={styles.booksRow}>
        <BookColumn
          label="내가 읽을 책"
          title={room.myStep?.bookTitle}
          coverImage={room.myStep?.coverImage}
          detail={readingDetail}
        />
        <View style={styles.divider} />
        <BookColumn
          label="내가 등록한 책"
          title={room.myBookStep?.bookTitle}
          coverImage={room.myBookStep?.coverImage}
          detail={registeredBookDetail}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7D8B8",
    borderRadius: 18,
    backgroundColor: "#FFFCF3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  groupName: {
    flex: 1,
    color: "#513A11",
    fontSize: 17,
    fontWeight: "700",
  },
  statusLabel: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FCF5D7",
    color: "#B8873D",
    fontSize: 12,
    fontWeight: "600",
  },
  booksRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  bookColumn: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  bookLabel: {
    marginBottom: 8,
    color: "#7B6A4A",
    fontSize: 12,
    fontWeight: "600",
  },
  cover: {
    width: 82,
    height: 118,
    borderWidth: 1,
    borderColor: "#D7C49C",
    borderRadius: 8,
    backgroundColor: "#F3F3F3",
  },
  bookTitle: {
    minHeight: 36,
    marginTop: 8,
    color: "#513A11",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    textAlign: "center",
  },
  bookDetail: {
    marginTop: 4,
    color: "#9B7B45",
    fontSize: 11,
    textAlign: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#E7D8B8",
  },
});
