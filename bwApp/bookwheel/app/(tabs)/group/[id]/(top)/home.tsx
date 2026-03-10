import { View } from "react-native";
import { router } from "expo-router";
import Button from "@/components/Button";

import GroupIntro from "@/components/group/GroupIntro";
import ApplicantList from "@/components/group/ApplicantList";
import { useGroupHome } from "@/hooks/useGroupHome";

export default function Home() {
  const { id, groupInfo, applicants } = useGroupHome();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "space-between",
      }}
    >
      <View>
        <GroupIntro intro={groupInfo.intro} rules={groupInfo.rules} />
      </View>

      <View style={{ paddingBottom: 12, alignItems: "center" }}>
        <ApplicantList applicants={applicants} />

        <Button
          title="채팅방"
          onPress={() => router.push("/group/[id]/chatroom")}
          color="#FCF5D7"
        />
      </View>
    </View>
  );
}
