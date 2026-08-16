import { ScrollView } from "react-native";
import { useGroupState } from "@/hooks/useGroupState";

import SessionProgress from "@/components/group/state/SessionProgress";
import CurrentBookSection from "@/components/group/state/CurrentBookSection";
import MemberStatusList from "@/components/group/state/MemberStatusList";
import BeforeStartDashboard from "@/components/group/state/BeforeStartDashboard";
import ScheduleReadyDashboard from "@/components/group/state/ScheduleReadyDashboard";

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
    remainingDays,
    canSetMemberOrder,
    schedule,
    isScheduleReady,
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
        coverImage={dashboard?.myBookStep?.coverImage}
        canSetMemberOrder={canSetMemberOrder}
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
        remainingDays={remainingDays}
      />

      <CurrentBookSection
        book={
          dashboard.myStep
            ? {
                title: dashboard.myStep.bookTitle,
                owner: dashboard.myStep.senderNickname,
                image: {
                  uri: dashboard.myStep.coverImage,
                },
              }
            : null
        }
        buttonText="현재 책 보러가기"
        onPress={() => {}}
      />

      <MemberStatusList members={members} />
    </ScrollView>
  );
}
