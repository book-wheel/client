import { View, Text } from "react-native";
import MemberRow from "@/components/member/MemberRow";
import { MemberStatus } from "@/hooks/useGroupState";

type Props = {
  members: MemberStatus[];
};

export default function MemberStatusList({ members }: Props) {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 32, marginBottom: 40 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#513A11",
          marginBottom: 12,
        }}
      >
        멤버별 상황
      </Text>

      {members.map((member) => (
        <View key={member.id} style={{ marginBottom: 8 }}>
          <MemberRow
            name={member.name}
            role={member.role}
            bookTitle={member.bookTitle}
            showBook
            status={member.status}
            buttonText=""
            variant="status"
            onPress={() => {}}
          />
        </View>
      ))}
    </View>
  );
}
