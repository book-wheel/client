import { View, Text } from "react-native";
import { router } from "expo-router";

import MemberRow from "@/components/member/MemberRow";
import { MemberStatus } from "@/hooks/useGroupState";

type Props = {
  id: string | undefined;
  members: MemberStatus[];
};

export default function MemberStatusList({ id, members }: Props) {
  const handleMemberPress = (member: MemberStatus) => {
    if (!id || !member.userPK) return;

    router.push({
      pathname: "/group/[id]/member-history",
      params: {
        id,
        userPK: member.userPK,
        memberName: member.name,
      },
    });
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        marginTop: 32,
        marginBottom: 40,
      }}
    >
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
            onPress={() => handleMemberPress(member)}
          />
        </View>
      ))}
    </View>
  );
}
