import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import { getDashboard, getGroupSchedule } from "@/api/group-dashboard";
import { getGroupMembers } from "@/api/group";
import { GroupMember } from "@/types/groupMembers";
import { GroupDashboardData, GroupScheduleData } from "@/types/groupDashboard";

export type MemberStatus = {
  id: string;
  name: string;
  bookTitle: string;
  role: "leader" | "vice" | "member";
  status: "completed" | "exchanging" | "reading" | "ready";
};

type CurrentBook = {
  id: string;
  title: string;
  owner: string;
  image: {
    uri: string;
  };
};

export function useGroupState() {
  const { id: rawId, memberId, newStatus } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // 대시보드 데이터
  const [dashboard, setDashboard] = useState<GroupDashboardData | null>(null);

  // 그룹 멤버 데이터
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

  // 멤버별 상태
  // 현재 멤버 API에는 status가 없기 때문에 상태만 임시로 관리
  const [memberStatuses, setMemberStatuses] = useState<
    Record<string, MemberStatus["status"]>
  >({});

  // 그룹 일정 데이터
  const [schedule, setSchedule] = useState<GroupScheduleData | null>(null);

  // 대시보드
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const dashboardData = await getDashboard(id);
        const membersData = await getGroupMembers(id);
        const scheduleData = await getGroupSchedule(id);

        console.log("대시보드", dashboardData);
        console.log("멤버", membersData);

        setDashboard(dashboardData);
        setGroupMembers(membersData.members);
        setSchedule(scheduleData);
      } catch (error) {
        console.error("모임 정보 조회 실패:", error);
      }
    };

    fetchData();
  }, [id]);

  // 현재 회차
  const session = dashboard?.currentRound ?? 0;

  // 현재 회차 일정
  const currentRound = schedule?.rounds.find(
    (round) => round.roundNumber === dashboard?.currentRound,
  );
  const getDateOnly = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const today = getDateOnly(new Date());

  const roundStartDate = currentRound
    ? getDateOnly(new Date(currentRound.startDate))
    : null;

  const elapsedDays =
    roundStartDate && today >= roundStartDate
      ? Math.floor(
          (today.getTime() - roundStartDate.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1
      : 0;

  const readingPeriod = schedule?.readingPeriod ?? 0;

  const currentReadingDay = Math.min(Math.max(elapsedDays, 0), readingPeriod);

  // 남은 일수
  const remainingDays = Math.max(readingPeriod - currentReadingDay, 0);

  // 현재 책
  const currentBook: CurrentBook | null = dashboard?.myStep
    ? {
        id: dashboard.myStep.bookId,
        title: dashboard.myStep.bookTitle,
        owner: dashboard.myStep.senderNickname,
        image: {
          uri: dashboard.myStep.coverImage,
        },
      }
    : null;

  // API 멤버 데이터를 화면에서 사용하는 MemberStatus 형태로 변환
  const members: MemberStatus[] = groupMembers.map((member) => ({
    id: member.memberId,
    name: member.nickname,
    bookTitle: "",
    role:
      member.role === "LEADER"
        ? "leader"
        : member.role === "VICE"
          ? "vice"
          : "member",
    status: memberStatuses[member.memberId] ?? "ready",
  }));

  // 멤버 상태 변경
  const updateMemberStatus = (id: string, status: MemberStatus["status"]) => {
    setMemberStatuses((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  // 현재 사용자
  const currentMember = members.find((m) => m.id === "1");

  // 전체 멤버 수
  const totalMembers = members.length;

  // 완독한 멤버 수
  const completedMembers = members.filter(
    (m) => m.status === "completed",
  ).length;

  // 현재 책 카드 버튼
  const handleCardButtonPress = () => {
    if (!currentMember) return;

    if (currentMember.status === "reading") {
      router.push({
        pathname: "/group/[id]/completed-books",
        params: {
          id,
          memberId: "1",
        },
      });
    } else if (currentMember.status === "completed") {
      updateMemberStatus("1", "ready");
    } else if (currentMember.status === "ready") {
      router.push({
        pathname: "/group/[id]/this-session",
        params: { id },
      });
    }
  };

  // 현재 책 카드 버튼 텍스트
  const getButtonText = () => {
    if (!currentMember) return "완독 인증 하기";

    switch (currentMember.status) {
      case "reading":
        return "완독 인증 하기";

      case "completed":
        return "전달 완료";

      case "ready":
        return "준비 완료";

      default:
        return "완독 인증 하기";
    }
  };

  // completed-books에서 돌아왔을 때 상태 변경
  useEffect(() => {
    if (memberId && newStatus) {
      const targetMemberId = Array.isArray(memberId) ? memberId[0] : memberId;

      updateMemberStatus(targetMemberId, newStatus as MemberStatus["status"]);
    }
  }, [memberId, newStatus]);

  // 현재는 화면 테스트를 위해 true
  // 나중에 다시 dashboard.currentRound 기준으로 변경
  const isStarted = true;

  const hasBook = dashboard?.myBookStep != null;

  return {
    id,
    session,
    members,
    totalMembers,
    completedMembers,
    currentMember,
    currentBook,
    handleCardButtonPress,
    getButtonText,
    isStarted,
    hasBook,
    dashboard,

    // 일정
    schedule,
    currentRound,
    readingPeriod,
    currentReadingDay,
    remainingDays,
  };
}
