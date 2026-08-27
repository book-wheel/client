import { ScrollView } from "react-native";
import { router } from "expo-router";
import { useGroupState } from "@/hooks/useGroupState";

import SessionProgress from "@/components/group/state/SessionProgress";
import CurrentBookSection from "@/components/group/state/CurrentBookSection";
import MemberStatusList from "@/components/group/state/MemberStatusList";
import BeforeStartDashboard from "@/components/group/state/BeforeStartDashboard";
import ScheduleReadyDashboard from "@/components/group/state/schedule";

export default function State() {
  const {
    id,
    members,
    groupMembers,
    hasBook,
    isStarted,
    dashboard,
    currentBook,
    session,
    readingPeriod,
    currentReadingDay,
    canSetMemberOrder,
    schedule,
    isScheduleReady,
    isLeader,
  } = useGroupState();

  // 일정이 준비 완료 상태일 때
  if (isScheduleReady && schedule) {
    return (
      <ScheduleReadyDashboard
        id={id!}
        schedule={schedule}
        members={groupMembers}
      />
    );
  }

  // 시작되지 않았을 때
  if (!isStarted) {
    return (
      <BeforeStartDashboard
        id={id}
        dDay={dashboard?.dDay}
        startDate={dashboard?.startDate}
        hasBook={hasBook}
        bookTitle={dashboard?.myBookStep?.bookTitle}
        coverImage={dashboard?.myBookStep?.coverImage ?? undefined}
        canSetMemberOrder={canSetMemberOrder}
        isLeader={isLeader}
      />
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <SessionProgress
        session={session}
        readingPeriod={readingPeriod}
        currentReadingDay={currentReadingDay}
        dDay={dashboard.dDay}
      />

      <CurrentBookSection
        book={currentBook}
        buttonText="완독 인증하기"
        onPress={() => {
          router.push({
            pathname: "/group/[id]/completed-books",
            params: { id },
          });
        }}
      />

      <MemberStatusList members={members} />
    </ScrollView>
  );
}
