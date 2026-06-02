import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MemberRow from "@/components/member/MemberRow";
import { Applicant } from "@/hooks/useGroupHome";

type Props = {
  applicants: Applicant[];
  onSelectApplicant: (applicant: Applicant) => void;
};

export default function ApplicantList({
  applicants,
  onSelectApplicant,
}: Props) {
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 17,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 18,
          borderWidth: 1,
          borderColor: "#F1ECE4",
        }}
      >
        {/* header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "#FFF8ED",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Ionicons name="person-add-outline" size={18} color="#A08A5B" />
          </View>

          <View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#513A11",
              }}
            >
              가입 신청
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#999",
                marginTop: 2,
              }}
            >
              현재 {applicants.length}명의 신청이 있어요
            </Text>
          </View>
        </View>

        {/* empty */}
        {applicants.length === 0 ? (
          <View
            style={{
              paddingVertical: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="mail-open-outline"
              size={34}
              color="#DDD"
              style={{ marginBottom: 10 }}
            />

            <Text
              style={{
                color: "#AAA",
                fontSize: 14,
              }}
            >
              아직 가입 신청이 없어요
            </Text>
          </View>
        ) : (
          applicants.map((member, index) => (
            <View
              key={member.id}
              style={{
                marginBottom: index === applicants.length - 1 ? 0 : 10,
              }}
            >
              <MemberRow
                name={member.name}
                profileUrl={member.profileImageUrl}
                buttonText="보기"
                onPress={() => onSelectApplicant(member)}
                variant="applicant"
              />
            </View>
          ))
        )}
      </View>
    </View>
  );
}
