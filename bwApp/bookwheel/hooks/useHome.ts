import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getMyInfo } from "@/api/auth";
import { getCurrentReadingBooks } from "@/api/books";
import { getMyGroups } from "@/api/group";
import type { MyGroup } from "@/types/group";
import type { CurrentReadingBookContent } from "@/types/books";

export function useHome() {
  const [nickname, setNickname] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rooms, setRooms] = useState<CurrentReadingBookContent[]>([]);
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHome = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [myInfoResponse, currentReadingResponse, groupResponse] =
        await Promise.all([
          getMyInfo(),
          getCurrentReadingBooks(),
          getMyGroups(),
        ]);

      setNickname(myInfoResponse.data.data?.nickname ?? "");
      setRooms(currentReadingResponse.data.data?.books ?? []);
      setMyGroups(
        groupResponse.map((group) => ({
          id: group.groupId,
          status: group.status,
          dday: group.dday,
          name: group.groupName,
          memberCount: `${group.currentMembers}/${group.maxMembers}`,
          type: group.groupOffline ? "오프라인" : "온라인",
          region: group.groupRegion ?? "",
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
