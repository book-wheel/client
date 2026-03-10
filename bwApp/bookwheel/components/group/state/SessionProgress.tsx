import { View, Text } from "react-native";
import ProgressBlocks from "@/components/groups/progress";

type Props = {
  session: number;
  totalMembers: number;
  completedMembers: number;
};

export default function SessionProgress({
  session,
  totalMembers,
  completedMembers,
}: Props) {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#513A11",
          marginBottom: 12,
        }}
      >
        {session}회차 독서 진행중
      </Text>

      <ProgressBlocks
        total={totalMembers}
        current={completedMembers}
        width={null}
        height={18}
      />
    </View>
  );
}
