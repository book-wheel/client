import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import { getDashboard } from "@/api/group-dashboard";
import { GroupDashboardData } from "@/types/groupDashboard";

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

const mockMembers: MemberStatus[] = [
  {
    id: "1",
    name: "김주옥",
    role: "leader",
    bookTitle: "해리포터와 마법사의 돌",
    status: "reading",
  },
  {
    id: "2",
    name: "사토 유키",
    role: "vice",
    bookTitle: "노르웨이의 숲",
    status: "completed",
  },
];

export function useGroupState() {
  const { id: rawId, memberId, newStatus } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // 대시보드 데이터
  const [dashboard, setDashboard] = useState<GroupDashboardData | null>(null);

  // 임시 members
  const [members, setMembers] = useState<MemberStatus[]>(mockMembers);

  // 대시보드 정보 조회
  useEffect(() => {
    if (!id) return;

    const fetchDashboard = async () => {
      try {
        const response = await getDashboard(id);

        console.log("대시보드", response.data);
        console.log("내 책", response.data.myBookStep);

        setDashboard(response.data);
      } catch (error) {
        console.error("대시보드 조회 실패:", error);
      }
    };

    fetchDashboard();
  }, [id]);

  // 현재 회차
  const session = dashboard?.currentRound ?? 0;

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

  const updateMemberStatus = (id: string, status: MemberStatus["status"]) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const currentMember = members.find((m) => m.id === "1");

  const totalMembers = members.length;

  const completedMembers = members.filter(
    (m) => m.status === "completed",
  ).length;

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

  useEffect(() => {
    if (memberId && newStatus) {
      updateMemberStatus(
        Array.isArray(memberId) ? memberId[0] : memberId,
        newStatus as MemberStatus["status"],
      );
    }
  }, [memberId, newStatus]);

  const isStarted = (dashboard?.currentRound ?? 0) > 0;

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
  };
}
