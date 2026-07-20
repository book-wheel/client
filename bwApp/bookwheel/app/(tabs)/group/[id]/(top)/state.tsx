import { ScrollView } from "react-native";
import { useGroupState } from "@/hooks/useGroupState";

import SessionProgress from "@/components/group/state/SessionProgress";
import CurrentBookSection from "@/components/group/state/CurrentBookSection";
import MemberStatusList from "@/components/group/state/MemberStatusList";
import BeforeStartDashboard from "@/components/group/state/BeforeStartDashboard";

export default function State() {
  const {
    id,
    session,
    members,
    totalMembers,
    completedMembers,
    currentBook,
    getButtonText,
    handleCardButtonPress,
    isStarted,
    hasBook,
    dashboard,
  } = useGroupState();

  if (!isStarted) {
    return (
      <BeforeStartDashboard
        id={id}
        dDay={dashboard?.dDay}
        hasBook={hasBook}
        bookTitle={dashboard?.myBookStep?.bookTitle}
      />
    );
  }

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
