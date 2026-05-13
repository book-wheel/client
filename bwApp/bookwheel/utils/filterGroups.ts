import { ExtendedGroup } from "@/components/groups/GroupListExtended";

type Params = {
  groups: ExtendedGroup[];
  filter: string;
  advancedFilter: {
    months: number;
    maxMembers: number;
  };
  selectedRegions: string[];
};

export const filterGroups = ({
  groups,
  filter,
  advancedFilter,
  selectedRegions,
}: Params) => {
  return groups.filter((g) => {
    // 온라인 / 오프라인 필터
    const typeCondition =
      filter === "all"
        ? true
        : filter === "online"
          ? !g.isOffline
          : filter === "offline"
            ? g.isOffline
            : true;

    // 지역 필터 (오프라인 때만)
    const regionCondition =
      filter !== "offline"
        ? true
        : selectedRegions.length === 0
          ? true
          : selectedRegions.includes(g.region ?? "");

    // advanced 아닐 땐 무조건 통과
    if (filter !== "advanced") {
      return typeCondition && regionCondition;
    }

    // 최대 인원 필터
    const memberCondition = g.maxPeople <= advancedFilter.maxMembers;

    // 시작일 없으면 제외
    if (!g.startDate) return false;

    const startDate = new Date(g.startDate);
    const now = new Date();

    const diffMonth =
      (startDate.getFullYear() - now.getFullYear()) * 12 +
      (startDate.getMonth() - now.getMonth());

    const monthCondition = diffMonth <= advancedFilter.months;

    return typeCondition && memberCondition && monthCondition;
  });
};
