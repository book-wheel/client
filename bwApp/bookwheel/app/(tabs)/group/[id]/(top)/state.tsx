import { ScrollView } from "react-native";
import { useGroupState } from "@/hooks/useGroupState";

import SessionProgress from "@/components/group/state/SessionProgress";
import CurrentBookSection from "@/components/group/state/CurrentBookSection";
import MemberStatusList from "@/components/group/state/MemberStatusList";

export default function State() {
  const {
    session,
    members,
    totalMembers,
    completedMembers,
    currentBook,
    getButtonText,
    handleCardButtonPress,
  } = useGroupState();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <SessionProgress
        session={session}
        totalMembers={totalMembers}
        completedMembers={completedMembers}
      />

      <CurrentBookSection
        book={currentBook}
        buttonText={getButtonText()}
        onPress={handleCardButtonPress}
      />

      <MemberStatusList members={members} />
    </ScrollView>
  );
}
