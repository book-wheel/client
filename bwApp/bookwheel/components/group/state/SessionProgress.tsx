import { View, Text } from "react-native";
import ProgressBlocks from "@/components/groups/progress";

type Props = {
  session: number;
  readingPeriod: number;
  currentReadingDay: number;
  dDay: number;
};

const formatDDay = (dDay: number) => {
  if (dDay === 0) return "D-Day";
  if (dDay < 0) return `D+${Math.abs(dDay)}`;
  return `D-${dDay}`;
};

export default function SessionProgress({
  session,
  readingPeriod,
  currentReadingDay,
  dDay,
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
        {session}회차 독서 진행 중 ({formatDDay(dDay)})
      </Text>

      <ProgressBlocks
        total={readingPeriod}
        current={currentReadingDay}
        width="100%"
        height={18}
      />
    </View>
  );
}
