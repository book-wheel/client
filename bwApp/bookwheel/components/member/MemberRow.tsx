import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ProfileImage from "@/components/profile/image";

type Role = "leader" | "vice" | "member";

type Status = "completed" | "exchanging" | "reading" | "ready";

type Props = {
  name: string;
  profileUrl?: string;

  role?: Role;

  showBook?: boolean;
  bookTitle?: string;

  buttonText: string;
  onPress: () => void;

  status?: Status;

  variant?: "home" | "status";
};

export default function MemberRow({
  name,
  profileUrl,
  role,
  showBook = false,
  bookTitle,
  buttonText,
  onPress,
  status,
  variant = "home",
}: Props) {
  return (
    <View style={styles.container}>
      {/* 프로필 */}
      <ProfileImage uri={profileUrl} size={44} showCamera={false} />

      {/* 이름 + 책 */}
      <View style={styles.info}>
        {/* 이름 + 역할 */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>

          {role === "leader" && <Text style={styles.role}> 모임장</Text>}

          {role === "vice" && <Text style={styles.role}> 모임부장</Text>}
        </View>

        {/* 책 제목 (status 화면에서만) */}
        {variant === "status" && showBook && (
          <Text style={styles.book}>{bookTitle}</Text>
        )}
      </View>

      {/* 버튼 */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>
          {status ? getStatusText(status) : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function getStatusText(status: Status) {
  switch (status) {
    case "completed":
      return "완독";
    case "exchanging":
      return "교환중";
    case "reading":
      return "독서중";
    case "ready":
      return "준비완료";
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  role: {
    fontSize: 12,
    color: "#888",
    marginLeft: 6,
  },

  book: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  button: {
    backgroundColor: "#FCF5D7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
