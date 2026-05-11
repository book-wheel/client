import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import SearchInput from "@/components/Input/search";
import FilterBar from "@/components/Filter/FilterBar";
import OfflineRegionSheet from "@/components/Filter/OfflineRegionSheet";
import AdvancedFilterSheet from "@/components/Filter/AdvancedFilterSheet";
import GroupListExtended, {
  ExtendedGroup,
} from "@/components/groups/GroupListExtended";

import GroupJoinModal from "@/components/groups/GroupJoinModal";
import { filterGroups } from "@/utils/filterGroups";
import { mapGroups } from "@/utils/mapGroups";

import { getGroups } from "@/api/group";

export default function Explore() {
  //지역 매핑
  const REGION_MAP: Record<string, string> = {
    서울: "SEOUL",
    경기: "GYEONGGI",
    인천: "INCHEON",
    강원: "GANGWON",
    충북: "CHUNG_BUK",
    충남: "CHUNG_NAM",
    대전: "DAEJEON",
    세종: "SEJONG",
    전북: "JEON_BUK",
    전남: "JEON_NAM",
    광주: "GWANGJU",
    경북: "GYEONG_BUK",
    경남: "GYEONG_NAM",
    대구: "DAEGU",
    울산: "ULSAN",
    부산: "BUSAN",
    제주: "JEJU",
  };

  //검색창
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //그룹 리스트 가져오기
  const fetchGroups = async (
    keyword: string = "",
    type?: "ONLINE" | "OFFLINE",
  ) => {
    try {
      setIsLoading(true);

      const response = await getGroups({
        keyword,
        type,
      });

      const mappedGroups = mapGroups(response.data.content);

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
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ExtendedGroup | null>(
    null,
  );

  const filteredGroups = filterGroups({
    groups,
    filter,
    advancedFilter,
    selectedRegions,
  });

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
    if (filter === "online") {
      fetchGroups(query, "ONLINE");
    } else if (filter === "offline") {
      fetchGroups(query, "OFFLINE");
    } else if (filter === "advanced") {
      fetchGroups(query);
    } else {
      fetchGroups(query);
    }
  }, [filter, advancedFilter, query]);

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
        onChange={(value) => {
          setFilter(value);

          if (value === "all") {
            setSelectedRegions([]);
          }
        }}
        onOpenSubFilter={(key) => {
          if (key === "offline") setOfflineOpen(true);
          if (key === "advanced") setAdvancedOpen(true);
        }}
      />
      <OfflineRegionSheet
        visible={offlineOpen}
        onClose={() => setOfflineOpen(false)}
        onSelect={(regions) => {
          const filtered = regions.filter((r) => r !== "전체");

          const mapped = filtered.map((r) => REGION_MAP[r]);

          setSelectedRegions(mapped);

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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 26,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", paddingHorizontal: 16 }}>
          {filteredGroups.map((g) => (
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
      </ScrollView>
    </>
  );
}
