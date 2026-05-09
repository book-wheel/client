import { useEffect, useState } from "react";
import { View } from "react-native";
import SearchInput from "@/components/Input/search";
import FilterBar from "@/components/Filter/FilterBar";
import OfflineRegionSheet from "@/components/Filter/OfflineRegionSheet";
import AdvancedFilterSheet from "@/components/Filter/AdvancedFilterSheet";
import GroupListExtended, {
  ExtendedGroup,
} from "@/components/groups/GroupListExtended";
import GroupJoinModal from "@/components/groups/GroupJoinModal";

import { getGroups } from "@/api/group";

export default function Explore() {
  //검색창
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //그룹 리스트 가져오기
  const fetchGroups = async (keyword: string = "") => {
    try {
      setIsLoading(true);

      const response = await getGroups({
        keyword,
      });

      const mappedGroups: ExtendedGroup[] = response.data.content.map(
        (g: any) => ({
          id: g.groupId,
          title: g.groupName,
          description: g.groupComment,

          isOffline: g.groupOffline,

          region: g.groupRegion,

          // 공개/비공개
          isPrivate: !g.groupPublic,

          // 상태 매핑
          status:
            g.groupState === "RECRUITING"
              ? "scheduled"
              : g.groupState === "IN_PROGRESS"
                ? "progress"
                : "complete",

          total: g.groupRoundCount,
          current: g.currentMembers,
          maxPeople: g.maxMembers,

          dday: g.dday,
          startDate: g.startDate,
        }),
      );

      setGroups(mappedGroups);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //필터링
  const groupFilters = [
    { key: "all", label: "전체" },
    { key: "online", label: "온라인" },
    { key: "offline", label: "오프라인", hasChildren: true },
    { key: "advanced", label: "그 외", hasChildren: true },
  ];

  const [filter, setFilter] = useState("all");
  const [offlineOpen, setOfflineOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState<{
    months: number;
    maxMembers: number;
  }>({
    months: 3,
    maxMembers: 10,
  });

  const [groups, setGroups] = useState<ExtendedGroup[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<ExtendedGroup | null>(
    null,
  );

  //그 외 상태관리
  const [open, setOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true); // 그룹 타입
  const [step, setStep] = useState<1 | 2>(1);

  const openJoin = (group: ExtendedGroup) => {
    setSelectedGroup(group);
    if (group.isPrivate) {
      // 비공개방 -> 비밀번호 단계
      setIsPrivate(true);
      setStep(1);
      setOpen(true);
    } else {
      // 공개방 -> 바로 가입 메시지 단계
      setIsPrivate(false);
      setStep(2);
      setOpen(true);
    }
  };
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      {/* 검색창 */}
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="모임 검색"
        onSubmit={() => fetchGroups(query)}
        loading={isLoading}
      />
      {/* 필터바 */}
      <FilterBar
        options={groupFilters}
        value={filter}
        onChange={setFilter}
        onOpenSubFilter={(key) => {
          if (key === "offline") setOfflineOpen(true);
          if (key === "advanced") setAdvancedOpen(true);
        }}
      />
      <OfflineRegionSheet
        visible={offlineOpen}
        onClose={() => setOfflineOpen(false)}
        onSelect={(region) => {
          console.log("선택한 지역:", region);
          setFilter("offline");
          setOfflineOpen(false);
        }}
      />

      <AdvancedFilterSheet
        visible={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        onApply={(data) => {
          setAdvancedFilter(data);
          setFilter("advanced");
          setAdvancedOpen(false);
        }}
      />
      <View style={{ flex: 1, alignItems: "center", marginTop: 26 }}>
        <View style={{ width: "100%", paddingHorizontal: 16 }}>
          {groups.map((g) => (
            <GroupListExtended
              key={g.id}
              group={g}
              onJoin={(group) => openJoin(group)}
              isPending={joinedIds.includes(g.id)}
            />
          ))}
        </View>

        {/* 가입 모달------------------------------------------------ */}

        <GroupJoinModal
          open={open}
          setOpen={setOpen}
          step={step}
          setStep={setStep}
          selectedGroup={selectedGroup}
          joinedIds={joinedIds}
          setJoinedIds={setJoinedIds}
        />
      </View>
    </>
  );
}
