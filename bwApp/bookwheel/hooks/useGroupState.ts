import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDashboard, getGroupSchedule } from "@/api/group-dashboard";
import { getGroupMembers } from "@/api/group";
import { GroupMember } from "@/types/groupMembers";
import { GroupDashboardData, GroupScheduleData } from "@/types/groupDashboard";

export type MemberStatus = {
  id: string;
  userPK: string;
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

type GroupSchedule = {
  scheduleStatus:
    | "NOT_CONFIGURED"
    | "CONFIGURED"
    | "READY"
    | "RESCHEDULE_REQUIRED"
    | "IN_PROGRESS"
    | "COMPLETE";
  targetMemberCount: number;
  currentMemberCount: number;
  canStart: boolean;
  missingBookMembers: {
    userPK: string;
    nickname: string;
  }[];
};

type TokenPayload = {
  sub: string;
};

export function useGroupState() {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // 대시보드 데이터
  const [dashboard, setDashboard] = useState<GroupDashboardData | null>(null);

  // 그룹 멤버 데이터
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

  const [currentUserPK, setCurrentUserPK] = useState<string | null>(null);

  // 현재 사용자가 그룹 리더인지 여부
  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) return;

      try {
        const payload = jwtDecode<TokenPayload>(token);
        setCurrentUserPK(payload.sub);
      } catch (error) {
        console.error("토큰 디코딩 실패:", error);
      }
    };

    loadCurrentUser();
  }, []);

  // 현재 사용자의 그룹 내 역할 확인
  const currentUser = groupMembers.find(
    (member) => member.userPK === currentUserPK,
  );

  const isLeader = currentUser?.role === "LEADER";

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
        console.log("일정", scheduleData);

        setDashboard(dashboardData);
        setGroupMembers(membersData.members);
        setSchedule(scheduleData);
      } catch (error) {
        console.error("모임 정보 조회 실패:", error);

        Alert.alert(
          "모임 정보를 불러올 수 없습니다.",
          "잠시 후 다시 시도해주세요.",
        );
      }
    };

    fetchData();
  }, [id]);

  // 현재 세션(진행 중인 라운드) 계산
  // 현재 회차
  const session = dashboard?.currentRound ?? 0;

  const currentRound = schedule?.rounds.find(
    (round) => round.roundNumber === session,
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

  // 현재 책 정보
  const currentBook: CurrentBook | null = currentRound
    ? {
        id: currentRound.bookId,
        title: currentRound.bookTitle,
        owner: currentRound.senderNickname,
        image: {
          uri: currentRound.coverImage,
        },
      }
    : dashboard?.myStep
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
  const members: MemberStatus[] = groupMembers.map((member) => {
    const assignment = member.currentRoundAssignment;

    let status: MemberStatus["status"] = "ready";

    if (assignment?.readingStatus === "COMPLETED") {
      status = "completed";
    } else if (assignment?.readingStatus === "READING") {
      status = "reading";
    } else if (assignment?.readingStatus === "READY") {
      status = "ready";
    }

    return {
      id: member.memberId,
      userPK: member.userPK,
      name: member.nickname,
      bookTitle: assignment?.bookTitle ?? "",
      role:
        member.role === "LEADER"
          ? "leader"
          : member.role === "VICE"
            ? "vice"
            : "member",
      status,
    };
  });

  // 멤버 순서 지정 가능 여부
  const canSetMemberOrder =
    schedule != null && schedule.missingBookMembers.length === 0;

  const isScheduleReady = schedule?.scheduleStatus === "READY";

  // 현재 사용자
  const currentMember = members.find(
    (member) => member.userPK === currentUserPK,
  );

  // 전체 멤버 수
  const totalMembers = members.length;

  // 완독한 멤버 수
  const completedMembers = members.filter(
    (m) => m.status === "completed",
  ).length;

  // 일정이 시작되었는지 여부
  const isStarted =
    schedule?.scheduleStatus === "IN_PROGRESS" ||
    (dashboard?.currentRound ?? 0) > 0;

  const hasBook = dashboard?.myBookStep != null;

  return {
    id,
    session,
    members,
    groupMembers,
    totalMembers,
    completedMembers,
    currentMember,
    currentBook,
    isStarted,
    hasBook,
    dashboard,

    currentUserPK,

    schedule,
    currentRound,
    readingPeriod,
    currentReadingDay,
    remainingDays,

    canSetMemberOrder,
    isScheduleReady,
    isLeader,
  };
}
