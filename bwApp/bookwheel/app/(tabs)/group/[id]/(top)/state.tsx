import { Alert, ScrollView, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { useGroupState } from "@/hooks/useGroupState";
import { createFutureSchedule } from "@/api/group-dashboard";

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
        buttonText="완독 인증하기"
        onPress={() => {
          router.push({
            pathname: "/group/[id]/completed-books",
            params: { id },
          });
        }}
      />

      <TouchableOpacity
        onPress={async () => {
          if (!id || !schedule) {
            Alert.alert(
              "일정 생성 실패",
              "모임 또는 일정 정보를 불러오지 못했습니다.",
            );
            return;
          }

          try {
            const result = await createFutureSchedule(id, {
              totalRoundCount: 1,
              readingPeriod: schedule.readingPeriod,
              endDate: getFutureDate(),
              excludedDates: schedule.excludedDates,
              excludedDateRanges: schedule.excludedDateRanges,
            });

            console.log("미래 일정 생성 성공", result);

            Alert.alert(
              "일정 생성 완료",
              "미래 일정이 성공적으로 생성되었습니다.",
            );
          } catch (error: any) {
            console.error(
              "미래 일정 생성 실패:",
              error?.response?.status,
              JSON.stringify(error?.response?.data, null, 2),
            );

            Alert.alert(
              "일정 생성 실패",
              error?.response?.data?.error?.message ??
                "일정을 생성하지 못했습니다. 다시 시도해주세요.",
            );
          }
        }}
        style={{
          margin: 20,
          padding: 15,
          backgroundColor: "#E4A54E",
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#FFF", textAlign: "center" }}>
          미래 일정 생성 테스트
        </Text>
      </TouchableOpacity>

      <MemberStatusList members={members} />
    </ScrollView>
  );
}
