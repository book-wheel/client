import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getMyInfo } from "@/api/auth";
import { getMyGroups, getMyReadingCards } from "@/api/group";
import type { MyGroup } from "@/types/group";
import type { HomeReadingRoom } from "@/types/room";

const GROUP_REGION_LABELS: Record<string, string> = {
  SEOUL: "서울",
  GYEONGGI: "경기",
  INCHEON: "인천",
  GANGWON: "강원",
  CHUNG_BUK: "충북",
  CHUNG_NAM: "충남",
  DAEJEON: "대전",
  SEJONG: "세종",
  JEON_BUK: "전북",
  JEON_NAM: "전남",
  GWANGJU: "광주",
  GYEONG_BUK: "경북",
  GYEONG_NAM: "경남",
  DAEGU: "대구",
  ULSAN: "울산",
  BUSAN: "부산",
  JEJU: "제주",
};

const getGroupRegionLabel = (region: string | null) =>
  region ? (GROUP_REGION_LABELS[region] ?? region) : "";

export function useHome() {
  const [nickname, setNickname] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rooms, setRooms] = useState<HomeReadingRoom[]>([]);
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHome = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [myInfoResponse, groupResponse, readingCards] = await Promise.all([
        getMyInfo(),
        getMyGroups(),
        getMyReadingCards(),
      ]);

      setNickname(myInfoResponse.data.data?.nickname ?? "");
      setRooms(readingCards);
      setMyGroups(
        groupResponse.map((group) => ({
          id: group.groupId,
          status: group.status,
          dday: group.dday,
          name: group.groupName,
          memberCount: `${group.currentMembers}/${group.maxMembers}`,
          type: group.groupOffline ? "오프라인" : "온라인",
          region: getGroupRegionLabel(group.groupRegion),
          info: group.groupComment,
        })),
      );
    } catch (fetchError) {
      console.error("홈 화면 데이터 조회 실패", fetchError);
      setError("홈 화면 정보를 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchHome();
    }, [fetchHome]),
  );

  return {
    nickname,
    rooms,
    currentIndex,
    setCurrentIndex,
    myGroups,
    isLoading,
    error,
  };
}
