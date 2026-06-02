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

  variant?: "home" | "status" | "applicant";
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
    <View
      style={[
        styles.container,
        variant === "applicant" && styles.applicantContainer,
      ]}
    >
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

        {/* 책 제목 */}
        {variant === "status" && showBook && (
          <Text style={styles.book}>{bookTitle}</Text>
        )}

        {/* 신청자용 서브텍스트 */}
        {variant === "applicant" && (
          <Text style={styles.applicantSub}>가입 신청을 보냈어요!</Text>
        )}
      </View>

      {/* 버튼 */}
      <TouchableOpacity
        style={[
          styles.button,
          variant === "applicant" && styles.applicantButton,
        ]}
        onPress={onPress}
      >
        <Text
          style={[
            styles.buttonText,
            variant === "applicant" && styles.applicantButtonText,
          ]}
        >
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
    alignItems: "flex-start",

    paddingHorizontal: 4,
    paddingVertical: 12,
  },

  applicantContainer: {
    backgroundColor: "#FFF",

    borderBottomWidth: 1,
    borderBottomColor: "#F2EEE8",

    borderRadius: 0,
    borderWidth: 0,

    paddingHorizontal: 6,
    paddingVertical: 12,
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2F2F2F",
  },

  role: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
  },

  applicantSub: {
    fontSize: 12,
    color: "#8A8A8A",
    marginTop: 2,
  },

  button: {
    backgroundColor: "#FCF5D7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  applicantButton: {
    backgroundColor: "#F7E7BE",
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#513A11",
  },

  applicantButtonText: {
    color: "#7A5315",
  },

  book: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
