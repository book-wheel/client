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

    // 최대 인원 필터
    const memberCondition = g.maxPeople <= advancedFilter.maxMembers;

    // 시작 개월 수 필터
    if (!g.startDate) return false;

    const startDate = new Date(g.startDate);
    const now = new Date();

    const diffMonth =
      (startDate.getFullYear() - now.getFullYear()) * 12 +
      (startDate.getMonth() - now.getMonth());

    const monthCondition = diffMonth <= advancedFilter.months;

    const regionCondition =
      selectedRegions.length === 0 || selectedRegions.includes(g.region ?? "");

    return (
      typeCondition && memberCondition && monthCondition && regionCondition
    );
  });
};
