import { View, Text } from "react-native";
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
    <View style={{ width: "100%", paddingHorizontal: 20 }}>
      <Text
        style={{
          fontSize: 18,
          marginBottom: 12,
          fontWeight: "bold",
          color: "#513A11",
        }}
      >
        가입 신청
      </Text>

      {applicants.length === 0 ? (
        <View
          style={{
            borderRadius: 8,
            paddingVertical: 24,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              color: "#A08A5B",
              fontSize: 14,
              fontStyle: "italic",
            }}
          >
            가입신청이 없어요
          </Text>
        </View>
      ) : (
        applicants.map((member) => (
          <View key={member.id} style={{ marginBottom: 8 }}>
            <MemberRow
              name={member.name}
              buttonText="보기"
              onPress={() => onSelectApplicant(member)}
              variant="home"
            />
          </View>
        ))
      )}
    </View>
  );
}
