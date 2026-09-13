import { Alert, ScrollView, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { useGroupState } from "@/hooks/useGroupState";
import { createFutureSchedule } from "@/api/group-dashboard";

import SessionProgress from "@/components/group/state/SessionProgress";
import CurrentBookSection from "@/components/group/state/CurrentBookSection";
import MemberStatusList from "@/components/group/state/MemberStatusList";
import BeforeStartDashboard from "@/components/group/state/BeforeStartDashboard";
import ScheduleReadyDashboard from "@/components/group/state/schedule";
import CompletedGroupDashboard from "@/components/group/state/CompletedGroupDashboard";

export default function State() {
  const {
    id,
    members,
    groupMembers,
    hasBook,
    isCompleted,
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
    isLeader,
  } = useGroupState();

  const getFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);

    return date.toISOString().split("T")[0];
  };

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

  // 일정이 완료된 상태일 때
  if (isCompleted && dashboard && schedule) {
    return (
      <CompletedGroupDashboard
        id={id}
        dashboard={dashboard}
        members={members}
        schedule={schedule}
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
        isLeader={isLeader}
      />
    );
  }

  if (!dashboard) {
    return null;
  }

  const myStep = dashboard.myStep;

  const isMyBookCompleted = myStep?.status === "COMPLETED";

  // 현재 라운드가 마지막 라운드인지
  const isLastRound = dashboard.currentRound === dashboard.totalRound;

  // 다음 라운드가 있는지
  const hasNextRound =
    !isLastRound && dashboard.currentRound < dashboard.totalRound;

  let buttonText = "완독 인증하기";
  let buttonDisabled = false;

  if (isMyBookCompleted && hasNextRound) {
    buttonText = "책 준비 완료";
  } else if (isMyBookCompleted && !hasNextRound) {
    buttonText = "독서 완료";
    buttonDisabled = true;
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
        book={currentBook}
        buttonText={buttonText}
        disabled={buttonDisabled}
        onPress={() => {
          if (buttonDisabled) return;
          if (!dashboard.myStep || !id) return;

          // 완독 완료 후 다음 라운드가 있는 경우
          if (isMyBookCompleted && hasNextRound) {
            router.push({
              pathname: "/group/[id]/this-session",
              params: {
                id,
              },
            });
            return;
          }

          // 아직 완독하지 않은 경우
          router.push({
            pathname: "/group/[id]/completed-books",
            params: {
              id,
              wheelStateId: dashboard.myStep.wheelStateId,
              bookId: dashboard.myStep.bookId,
              bookTitle: dashboard.myStep.bookTitle,
              coverImage: dashboard.myStep.coverImage,
              senderNickname: dashboard.myStep.senderNickname,
            },
          });
        }}
      />

      <MemberStatusList id={id} members={members} />
    </ScrollView>
  );
}
